from fastapi import FastAPI
from app.api.routes.health import router as health_router

app = FastAPI(
    title="AskPaper",
    description="RAG-based Document Q&A System",
    version="0.1.0"
)

app.include_router(health_router)


@app.get("/")
def read_root():
    return {
        "status": "running",
        "message": "AskPaper is alive!",
        "version": "0.1.0"
    }