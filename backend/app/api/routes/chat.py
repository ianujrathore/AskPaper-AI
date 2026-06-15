from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from app.utils.security import verify_token
from app.utils.ai_pipeline import search_similar_chunks
from app.utils.llm import generate_answer

router = APIRouter()
security = HTTPBearer()


class AskRequest(BaseModel):
    document_id: int
    question: str


@router.post("/ask")
async def ask_question(
    request: AskRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    chunks = search_similar_chunks(request.question, request.document_id)
    
    if not chunks:
        raise HTTPException(status_code=404, detail="No relevant content found")
    
    answer = generate_answer(request.question, chunks)
    
    return {
        "question": request.question,
        "answer": answer,
        "sources": chunks
    }