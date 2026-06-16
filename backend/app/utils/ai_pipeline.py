from sentence_transformers import SentenceTransformer
import chromadb
import os

CHROMA_DIR = "chroma_db"
os.makedirs(CHROMA_DIR, exist_ok=True)

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path=CHROMA_DIR)


def get_embeddings(texts):
    if isinstance(texts, str):
        texts = [texts]
    return model.encode(texts).tolist()


def chunk_text_with_pages(text: str, pages_text: list, chunk_size: int = 500, overlap: int = 100):
    chunks = []
    page_map = []
    
    for page_num, page_text in enumerate(pages_text, start=1):
        start = 0
        while start < len(page_text):
            end = start + chunk_size
            chunk = page_text[start:end]
            if chunk.strip():
                chunks.append(chunk)
                page_map.append(page_num)
            start += (chunk_size - overlap)
    
    return chunks, page_map


def create_vector_store_with_pages(chunks: list, page_map: list, document_id: int):
    collection_name = f"doc_{document_id}"
    
    existing = [c.name for c in client.list_collections()]
    if collection_name in existing:
        client.delete_collection(collection_name)
    
    collection = client.create_collection(name=collection_name)
    embeddings_list = get_embeddings(chunks)
    if not embeddings_list:
        return
    
    ids = [f"chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"page": page_map[i]} for i in range(len(chunks))]
    collection.add(ids=ids, embeddings=embeddings_list, documents=chunks, metadatas=metadatas)


def search_similar_chunks_with_pages(query: str, document_id: int, top_k: int = 3):
    collection_name = f"doc_{document_id}"
    collection = client.get_collection(name=collection_name)
    
    query_embedding = get_embeddings([query])
    if not query_embedding:
        return [], []
    
    results = collection.query(query_embeddings=query_embedding, n_results=top_k)
    
    chunks = results["documents"][0] if results["documents"] else []
    metadatas = results["metadatas"][0] if results["metadatas"] else []
    pages = [m["page"] for m in metadatas] if metadatas else []
    
    return chunks, pages