from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import fitz
import os
from datetime import datetime

from app.utils.ai_pipeline import chunk_text_with_pages, create_vector_store_with_pages

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files allowed"}
    
    content = await file.read()
    file_size = len(content)
    
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    extracted_text = ""
    num_pages = 0
    pages_text = []
    
    try:
        pdf_doc = fitz.open(file_path)
        num_pages = pdf_doc.page_count
        for i in range(num_pages):
            page_text = pdf_doc[i].get_text()
            pages_text.append(page_text)
            extracted_text += page_text
        pdf_doc.close()
    except Exception:
        os.remove(file_path)
        return {"error": "Invalid PDF file"}
    
    doc_id = len(os.listdir(UPLOAD_DIR))
    chunks, page_map = chunk_text_with_pages(extracted_text, pages_text)
    create_vector_store_with_pages(chunks, page_map, doc_id)
    
    return {
        "document_id": doc_id,
        "filename": file.filename,
        "num_pages": num_pages,
        "file_size": file_size,
        "chunks_created": len(chunks),
        "text_preview": extracted_text[:200] + "..." if len(extracted_text) > 200 else extracted_text
    }