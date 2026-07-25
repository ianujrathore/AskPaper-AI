from fastapi import APIRouter, UploadFile, File
import fitz
import os
from datetime import datetime, timezone

from app.utils.ai_pipeline import chunk_text_with_pages, create_vector_store_with_pages

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files allowed"}

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        return {"error": "File too large. Maximum 50MB allowed."}

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    try:
        pdf_doc = fitz.open(file_path)
        num_pages = pdf_doc.page_count
        pages_text = [pdf_doc[i].get_text() for i in range(num_pages)]
        extracted_text = "".join(pages_text)
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
        "file_size": len(content),
        "chunks_created": len(chunks),
        "text_preview": extracted_text[:200] + "..." if len(extracted_text) > 200 else extracted_text
    }