from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes.health import router as health_router
from app.api.routes.documents import router as documents_router
from app.api.routes.chat import router as chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("AskPaper API started")
    yield
    print("AskPaper API shutting down")


app = FastAPI(
    title="AskPaper",
    description="RAG-based Document Q&A System",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(documents_router)
app.include_router(chat_router)


@app.get("/")
def read_root():
    return {
        "status": "running",
        "message": "AskPaper is alive!",
        "version": "0.1.0"
    }