from sentence_transformers import SentenceTransformer
import chromadb
import os

CHROMA_DIR = "chroma_db"
os.makedirs(CHROMA_DIR, exist_ok=True)

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path=CHROMA_DIR)


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
    
    if collection_name in [c.name for c in client.list_collections()]:
        client.delete_collection(collection_name)
    
    collection = client.create_collection(name=collection_name)
    
    embeddings_list = model.encode(chunks).tolist()
    ids = [f"chunk_{i}" for i in range(len(chunks))]
    
    collection.add(
        ids=ids,
        embeddings=embeddings_list,
        documents=chunks
    )


def search_similar_chunks(query: str, document_id: int, top_k: int = 3):
    collection_name = f"doc_{document_id}"
    collection = client.get_collection(name=collection_name)
    
    query_embedding = model.encode([query]).tolist()
    
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )
    
    return results["documents"][0]