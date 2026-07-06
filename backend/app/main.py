from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, boards
from app.core.database import engine
from app.models.user import Base
# Import all models so their tables register with Base.metadata
from app.models.board import Board  # noqa: F401
from app.models.pin import Pin  # noqa: F401

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created/verified")
    yield

app = FastAPI(
    title="Palette API",
    description="Backend for Palette",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(boards.router)

@app.get("/")
def root():
    return {"message": "Welcome to Palette API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}