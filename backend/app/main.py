from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes.health import router as health_router
from app.api.routes.users import router as users_router
from app.api.routes.documents import router as documents_router
from app.api.routes.chat import router as chat_router
from app.db.session import engine, create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    print("Tables created & Database connected:", engine.url)
    yield
    await engine.dispose()
    print("Database disconnected")


app = FastAPI(
    title="AskPaper",
    description="RAG-based Document Q&A System",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(users_router)
app.include_router(documents_router)
app.include_router(chat_router)


@app.get("/")
def read_root():
    return {
        "status": "running",
        "message": "AskPaper is alive!",
        "version": "0.1.0"
    }