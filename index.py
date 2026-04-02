from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import YoutubeLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
import os
load_dotenv()

QDRANT_URL=os.getenv("QDRANT_URL")
QDRANT_API_KEY=os.getenv("QDRANT_API_KEY")



loader = YoutubeLoader.from_youtube_url(
    "https://www.youtube.com/watch?v=QsYGlZkevEg", add_video_info=False
)
script=loader.load()
text_spiltter=RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=400
)

chunks=text_spiltter.split_documents(documents=script)
embedding_model=OpenAIEmbeddings(
    model="text-embedding-3-large",
)

# embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

vector_store=QdrantVectorStore.from_documents(
    documents=chunks,
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    collection_name="yt-chatbot",
    embedding=embedding_model
)

print("Indexing phase is done....")