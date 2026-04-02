from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from openai import OpenAI
from fastapi import FastAPI, Request
load_dotenv()
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Document
import os

# qdrant_client = QdrantClient(
#     url="https://a2cfa293-78bf-4587-acc4-d3a4e09da601.us-east-1-1.aws.cloud.qdrant.io:6333", 
#     api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.LwO75b9eX7rlihtDssUV1SWjHmb1rTidOeE_sq8RCMs",
#     cloud_inference=True
# )



QDRANT_URL=os.getenv("QDRANT_URL")
QDRANT_API_KEY=os.getenv("QDRANT_API_KEY")

qdrant_client=QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    cloud_inference=True
)

# qdrant_client.create_collection(
#     collection_name="items",
#     vectors_config=VectorParams(size=384, distance=Distance.COSINE),
# )


client=OpenAI()

embedding_model=OpenAIEmbeddings(
    model="text-embedding-3-large",
)

vector_db=QdrantVectorStore.from_existing_collection(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    collection_name="yt-chatbot",
    embedding=embedding_model
)   

# vector_db=qdrant_client.get_collection


#take user input
user_query=input("Ask something related to this video \n \n")


search_results=vector_db.similarity_search(user_query)

context="\n\n".join([f"Transcript: {result.page_content}\nSource: {result.metadata.get('source', 'N/A')}" for result in search_results])
print(f"💀 context=> {context}")

SYSTEM_PROMPT=f"""
    You are a helpfull AI Assistant who answeres user query based on the youtube video transcript along with the timestamp of the video provided from the user.
    You should only answer the user based on the following context and navigate the user to open the right timestamp to know more. And strictly avoid answering the user query if the answer is not found in the context and instead ask the user to rephrase the query or ask something else.

    Context :
    {context}
"""


response=client.chat.completions.create(
    model="gpt-5",
    messages=[
        {"role":"system","content":SYSTEM_PROMPT},
        {"role":"user","content":user_query}
    ]
)

print(f"🤖: {response.choices[0].message.content}")