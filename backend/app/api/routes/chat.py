from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.ai_pipeline import search_similar_chunks_with_pages
from app.utils.llm import generate_answer

router = APIRouter()


class AskRequest(BaseModel):
    document_id: int
    question: str


@router.post("/ask")
async def ask_question(request: AskRequest):
    chunks, pages = search_similar_chunks_with_pages(request.question, request.document_id)
    
    if not chunks:
        return {
            "question": request.question,
            "answer": "No relevant content found in this document.",
            "sources": []
        }
    
    answer = generate_answer(request.question, chunks)
    
    return {
        "question": request.question,
        "answer": answer,
        "sources": [f"Page {p}" for p in pages]
    }