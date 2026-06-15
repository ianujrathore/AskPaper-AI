from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
import fitz
import os
from datetime import datetime

from app.db.session import get_db
from app.models.document import Document
from app.utils.security import verify_token
from app.utils.ai_pipeline import chunk_text, create_vector_store

router = APIRouter()
security = HTTPBearer()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("user_id")
    
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    content = await file.read()
    file_size = len(content)
    
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    extracted_text = ""
    num_pages = 0
    
    try:
        pdf_doc = fitz.open(file_path)
        num_pages = pdf_doc.page_count
        for page in pdf_doc:
            extracted_text += page.get_text()
        pdf_doc.close()
    except Exception:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail="Invalid PDF file")
    
    document = Document(
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text,
        num_pages=num_pages,
        file_size=file_size,
        user_id=user_id
    )
    
    db.add(document)
    await db.commit()
    await db.refresh(document)
    
    chunks = chunk_text(extracted_text)
    create_vector_store(chunks, document.id)
    
    return {
        "message": "PDF uploaded successfully",
        "document_id": document.id,
        "filename": document.filename,
        "num_pages": num_pages,
        "file_size": file_size,
        "chunks_created": len(chunks),
        "text_preview": extracted_text[:200] + "..." if len(extracted_text) > 200 else extracted_text
    }