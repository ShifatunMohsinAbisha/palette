from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.board import Board
from app.models.user import User
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/boards", tags=["Boards"])

class BoardCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cover_color: Optional[str] = "#FFD9E8"
    cover_emoji: Optional[str] = "🌸"
    is_private: Optional[bool] = False

class BoardResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    cover_color: str
    cover_emoji: str
    is_private: bool
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/", response_model=BoardResponse)
def create_board(board_data: BoardCreate, db: Session = Depends(get_db)):
    new_board = Board(
        title=board_data.title,
        description=board_data.description,
        cover_color=board_data.cover_color,
        cover_emoji=board_data.cover_emoji,
        is_private=board_data.is_private,
        owner_id=1
    )
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@router.get("/")
def get_boards(db: Session = Depends(get_db)):
    boards = db.query(Board).all()
    return boards

@router.get("/{board_id}")
def get_board(board_id: int, db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board