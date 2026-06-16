import requests
import chromadb
import os

CHROMA_DIR = "chroma_db"
os.makedirs(CHROMA_DIR, exist_ok=True)

HF_TOKEN = os.getenv("HF_TOKEN", "")
EMBEDDING_API = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

client = chromadb.PersistentClient(path=CHROMA_DIR)


def get_embeddings(texts):
    if isinstance(texts, str):
        texts = [texts]
    try:
        response = requests.post(EMBEDDING_API, headers=HEADERS, json={"inputs": texts}, timeout=30)
        if response.status_code == 200:
            return response.json()
    except:
        pass
    return []


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += (chunk_size - overlap)
    return chunks


def create_vector_store(chunks: list, document_id: int):
    collection_name = f"doc_{document_id}"
    
    existing = [c.name for c in client.list_collections()]
    if collection_name in existing:
        client.delete_collection(collection_name)
    
    collection = client.create_collection(name=collection_name)
    embeddings_list = get_embeddings(chunks)
    if not embeddings_list:
        return
    
    ids = [f"chunk_{i}" for i in range(len(chunks))]
    collection.add(ids=ids, embeddings=embeddings_list, documents=chunks)


def search_similar_chunks(query: str, document_id: int, top_k: int = 3):
    collection_name = f"doc_{document_id}"
    collection = client.get_collection(name=collection_name)
    
    query_embedding = get_embeddings([query])
    if not query_embedding:
        return []
    
    results = collection.query(query_embeddings=query_embedding, n_results=top_k)
    return results["documents"][0] if results["documents"] else []