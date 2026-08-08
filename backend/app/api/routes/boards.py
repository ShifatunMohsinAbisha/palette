from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.board import Board
from app.models.user import User
from app.models.pin import Pin
from app.models.song import Song
from app.models.board_like import BoardLike
from app.models.comment import Comment
from app.api.routes.auth import get_current_user
from app.utils.auth import verify_token
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/boards", tags=["Boards"])

class CommentCreate(BaseModel):
    text: str

class BoardCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cover_color: Optional[str] = "#FFD9E8"
    cover_emoji: Optional[str] = "🌸"
    is_private: Optional[bool] = False

class BoardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_color: Optional[str] = None
    cover_emoji: Optional[str] = None
    is_private: Optional[bool] = None

class BoardResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    cover_color: str
    cover_emoji: str
    is_private: bool
    owner_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class PinCreate(BaseModel):
    title: Optional[str] = None
    image_url: str
    note: Optional[str] = None

class SongCreate(BaseModel):
    title: str
    artist: str
    artwork_url: Optional[str] = None
    youtube_id: str
    duration: Optional[str] = None
    mood: Optional[str] = None
    color: Optional[str] = None
    emoji: Optional[str] = None

class RearrangeRequest(BaseModel):
    ids: List[int]

@router.post("/", response_model=BoardResponse)
def create_board(
    board_data: BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_board = Board(
        title=board_data.title,
        description=board_data.description,
        cover_color=board_data.cover_color,
        cover_emoji=board_data.cover_emoji,
        is_private=board_data.is_private,
        owner_id=current_user.id
    )
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@router.get("/")
def get_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    boards = db.query(Board).filter(Board.owner_id == current_user.id).all()
    return boards

@router.get("/public")
def get_public_boards(
    q: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    current_user_id = None
    if authorization and authorization.startswith("Bearer "):
        payload = verify_token(authorization.split(" ")[1])
        if payload and "sub" in payload:
            current_user_id = int(payload["sub"])

    query = db.query(Board).filter((Board.is_private == False) | (Board.is_private.is_(None)))
    if q and q.strip():
        search = f"%{q.strip()}%"
        query = query.filter((Board.title.ilike(search)) | (Board.description.ilike(search)))
    
    boards = query.order_by(Board.created_at.desc()).all()
    
    results = []
    for b in boards:
        owner = db.query(User).filter(User.id == b.owner_id).first() if b.owner_id else None
        pin_count = db.query(func.count(Pin.id)).filter(Pin.board_id == b.id).scalar() or 0
        likes_count = db.query(func.count(BoardLike.id)).filter(BoardLike.board_id == b.id).scalar() or 0
        is_liked = False
        if current_user_id:
            is_liked = db.query(BoardLike).filter(BoardLike.board_id == b.id, BoardLike.user_id == current_user_id).first() is not None

        results.append({
            "id": b.id,
            "title": b.title,
            "description": b.description,
            "cover_color": b.cover_color,
            "cover_emoji": b.cover_emoji,
            "is_private": b.is_private or False,
            "created_at": b.created_at,
            "owner_id": b.owner_id,
            "author": owner.full_name or owner.username if owner else "Anonymous",
            "author_username": owner.username if owner else "",
            "pins_count": pin_count,
            "likes_count": likes_count,
            "is_liked": is_liked,
        })
    return results

@router.get("/{board_id}")
def get_board(board_id: int, db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    # Fetch owner
    owner = None
    if board.owner_id:
        owner = db.query(User).filter(User.id == board.owner_id).first()
        
    # Fetch pins and songs
    pins = db.query(Pin).filter(Pin.board_id == board_id).order_by(Pin.position.asc(), Pin.id.asc()).all()
    songs = db.query(Song).filter(Song.board_id == board_id).order_by(Song.position.asc(), Song.id.asc()).all()
    
    return {
        "id": board.id,
        "title": board.title,
        "description": board.description,
        "cover_color": board.cover_color,
        "cover_emoji": board.cover_emoji,
        "is_private": board.is_private,
        "created_at": board.created_at,
        "owner_id": board.owner_id,
        "owner": {
            "username": owner.username if owner else "",
            "full_name": owner.full_name if owner else ""
        },
        "pins": pins,
        "songs": songs
    }

@router.post("/{board_id}/pins")
def add_pin(board_id: int, pin_data: PinCreate, db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    max_pos = db.query(func.max(Pin.position)).filter(Pin.board_id == board_id).scalar() or 0
    new_pin = Pin(
        title=pin_data.title,
        image_url=pin_data.image_url,
        note=pin_data.note,
        board_id=board_id,
        position=max_pos + 1
    )
    db.add(new_pin)
    db.commit()
    db.refresh(new_pin)
    return new_pin

@router.delete("/{board_id}/pins/{pin_id}")
def delete_pin(board_id: int, pin_id: int, db: Session = Depends(get_db)):
    pin = db.query(Pin).filter(Pin.id == pin_id, Pin.board_id == board_id).first()
    if not pin:
        raise HTTPException(status_code=404, detail="Pin not found")
    db.delete(pin)
    db.commit()
    return {"status": "success"}

@router.put("/{board_id}/pins/rearrange")
def rearrange_pins(board_id: int, req: RearrangeRequest, db: Session = Depends(get_db)):
    for index, pin_id in enumerate(req.ids):
        db.query(Pin).filter(Pin.id == pin_id, Pin.board_id == board_id).update({"position": index})
    db.commit()
    return {"status": "success"}

@router.post("/{board_id}/songs")
def add_song(board_id: int, song_data: SongCreate, db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    max_pos = db.query(func.max(Song.position)).filter(Song.board_id == board_id).scalar() or 0
    new_song = Song(
        title=song_data.title,
        artist=song_data.artist,
        artwork_url=song_data.artwork_url,
        youtube_id=song_data.youtube_id,
        duration=song_data.duration,
        mood=song_data.mood,
        color=song_data.color,
        emoji=song_data.emoji,
        board_id=board_id,
        position=max_pos + 1
    )
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return new_song

@router.delete("/{board_id}/songs/{song_id}")
def remove_song(board_id: int, song_id: int, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id, Song.board_id == board_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    db.delete(song)
    db.commit()
    return {"status": "success"}

@router.put("/{board_id}/songs/rearrange")
def rearrange_songs(board_id: int, req: RearrangeRequest, db: Session = Depends(get_db)):
    for index, song_id in enumerate(req.ids):
        db.query(Song).filter(Song.id == song_id, Song.board_id == board_id).update({"position": index})
    db.commit()
    return {"status": "success"}

@router.put("/{board_id}")
def update_board(
    board_id: int,
    updates: BoardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You don't own this board")

    if updates.title is not None:
        board.title = updates.title
    if updates.description is not None:
        board.description = updates.description
    if updates.cover_color is not None:
        board.cover_color = updates.cover_color
    if updates.cover_emoji is not None:
        board.cover_emoji = updates.cover_emoji
    if updates.is_private is not None:
        board.is_private = updates.is_private

    db.commit()
    db.refresh(board)
    return {
        "id": board.id,
        "title": board.title,
        "description": board.description,
        "cover_color": board.cover_color,
        "cover_emoji": board.cover_emoji,
        "is_private": board.is_private,
        "owner_id": board.owner_id,
        "created_at": board.created_at
    }

@router.delete("/{board_id}")
def delete_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You don't own this board")
    db.query(Pin).filter(Pin.board_id == board_id).delete()
    db.query(Song).filter(Song.board_id == board_id).delete()
    db.delete(board)
    db.commit()
    return {"status": "success"}

@router.post("/{board_id}/like")
def like_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    existing = db.query(BoardLike).filter(BoardLike.board_id == board_id, BoardLike.user_id == current_user.id).first()
    if not existing:
        like = BoardLike(user_id=current_user.id, board_id=board_id)
        db.add(like)
        db.commit()
    
    likes_count = db.query(func.count(BoardLike.id)).filter(BoardLike.board_id == board_id).scalar() or 0
    return {"status": "liked", "likes_count": likes_count, "is_liked": True}

@router.delete("/{board_id}/like")
def unlike_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(BoardLike).filter(BoardLike.board_id == board_id, BoardLike.user_id == current_user.id).first()
    if existing:
        db.delete(existing)
        db.commit()
    
    likes_count = db.query(func.count(BoardLike.id)).filter(BoardLike.board_id == board_id).scalar() or 0
    return {"status": "unliked", "likes_count": likes_count, "is_liked": False}

@router.post("/{board_id}/pins/{pin_id}/comments")
def add_comment(
    board_id: int,
    pin_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pin = db.query(Pin).filter(Pin.id == pin_id, Pin.board_id == board_id).first()
    if not pin:
        raise HTTPException(status_code=404, detail="Pin not found")
    
    if not comment_data.text.strip():
        raise HTTPException(status_code=400, detail="Comment text cannot be empty")
        
    comment = Comment(pin_id=pin_id, user_id=current_user.id, text=comment_data.text.strip())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    return {
        "id": comment.id,
        "pin_id": comment.pin_id,
        "user_id": comment.user_id,
        "text": comment.text,
        "created_at": comment.created_at,
        "author_name": current_user.full_name or current_user.username,
        "author_username": current_user.username,
        "author_avatar": current_user.avatar_url,
    }

@router.get("/{board_id}/pins/{pin_id}/comments")
def get_comments(
    board_id: int,
    pin_id: int,
    db: Session = Depends(get_db)
):
    comments = db.query(Comment).filter(Comment.pin_id == pin_id).order_by(Comment.created_at.asc()).all()
    results = []
    for c in comments:
        user = db.query(User).filter(User.id == c.user_id).first()
        results.append({
            "id": c.id,
            "pin_id": c.pin_id,
            "user_id": c.user_id,
            "text": c.text,
            "created_at": c.created_at,
            "author_name": user.full_name or user.username if user else "Anonymous",
            "author_username": user.username if user else "",
            "author_avatar": user.avatar_url if user else None,
        })
    return results