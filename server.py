import re
import os
from urllib.parse import urlparse, parse_qs

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_community.document_loaders import YoutubeLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from openai import OpenAI

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# ── FastAPI app ──────────────────────────────
app = FastAPI(title="ZenTube AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Shared resources ─────────────────────────
embedding_model = OpenAIEmbeddings(model="text-embedding-3-large")
openai_client = OpenAI()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=400)


# ── Pydantic models ─────────────────────────
class IndexRequest(BaseModel):
    youtube_url: str


class IndexResponse(BaseModel):
    video_id: str
    status: str
    chunks: int


class ChatRequest(BaseModel):
    video_id: str
    question: str


class ChatResponse(BaseModel):
    answer: str


# ── Helpers ──────────────────────────────────
def extract_video_id(url: str) -> str | None:
    """Extract the YouTube video ID from various URL formats."""
    parsed = urlparse(url)

    # youtu.be/VIDEO_ID
    if parsed.hostname and "youtu.be" in parsed.hostname:
        return parsed.path.lstrip("/").split("/")[0] or None

    # youtube.com/watch?v=VIDEO_ID
    if parsed.hostname and "youtube" in parsed.hostname:
        qs = parse_qs(parsed.query)
        if "v" in qs:
            return qs["v"][0]
        # youtube.com/embed/VIDEO_ID
        if parsed.path.startswith("/embed/"):
            return parsed.path.split("/embed/")[1].split("/")[0]

    return None


# ── Routes ───────────────────────────────────
@app.get("/")
def health():
    return {"status": "ok", "service": "ZenTube AI API"}


@app.post("/api/index", response_model=IndexResponse)
def index_video(req: IndexRequest):
    """Extract video ID from YouTube URL, load transcript, chunk, embed, and store in Qdrant."""

    # 1. Extract video ID
    video_id = extract_video_id(req.youtube_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL — could not extract video ID.")

    # 2. Load transcript
    try:
        loader = YoutubeLoader.from_youtube_url(
            req.youtube_url,
            add_video_info=False,
        )
        documents = loader.load()
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to load transcript for video {video_id}. Make sure the video has captions enabled. Error: {str(e)}",
        )

    if not documents:
        raise HTTPException(status_code=422, detail="No transcript found for this video.")

    # 3. Split into chunks
    chunks = text_splitter.split_documents(documents=documents)

    # 4. Embed and store in Qdrant
    try:
        QdrantVectorStore.from_documents(
            documents=chunks,
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
            collection_name=f"yt-{video_id}",
            embedding=embedding_model,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to index video into vector store. Error: {str(e)}",
        )

    return IndexResponse(
        video_id=video_id,
        status="indexed",
        chunks=len(chunks),
    )


@app.post("/api/chat", response_model=ChatResponse)
def chat_with_video(req: ChatRequest):
    """Retrieve relevant transcript chunks and answer the user's question via RAG."""

    # 1. Connect to the existing vector store for this video
    try:
        vector_db = QdrantVectorStore.from_existing_collection(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
            collection_name=f"yt-{req.video_id}",
            embedding=embedding_model,
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"No indexed data found for video '{req.video_id}'. Please index the video first. Error: {str(e)}",
        )

    # 2. Semantic search
    search_results = vector_db.similarity_search(req.question)

    if not search_results:
        return ChatResponse(answer="I couldn't find any relevant information in the video transcript for your question. Try rephrasing it.")

    # 3. Build context
    context = "\n\n".join(
        [
            f"Transcript: {result.page_content}\nSource: {result.metadata.get('source', 'N/A')}"
            for result in search_results
        ]
    )

    # 4. Generate answer via OpenAI
    system_prompt = f"""You are a helpful AI Assistant who answers user queries based on the YouTube video transcript provided below.
You should only answer based on the following context and navigate the user to relevant parts of the video when possible.
Strictly avoid answering if the answer is not found in the context — instead, ask the user to rephrase the query or ask something else.

Context:
{context}"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.question},
            ],
        )
        answer = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response. Error: {str(e)}",
        )

    return ChatResponse(answer=answer)