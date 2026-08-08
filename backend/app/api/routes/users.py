from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.core.database import get_db
from app.models.user import User
from app.models.follow import Follow
from app.models.board import Board
from app.api.routes.auth import get_current_user
from app.utils.auth import verify_token

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{user_id}")
def get_user_profile(
    user_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    is_following = False
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = verify_token(token)
        if payload and "sub" in payload:
            current_id = int(payload["sub"])
            f = db.query(Follow).filter(Follow.follower_id == current_id, Follow.following_id == user_id).first()
            if f:
                is_following = True

    followers = db.query(func.count(Follow.id)).filter(Follow.following_id == user_id).scalar() or 0
    following = db.query(func.count(Follow.id)).filter(Follow.follower_id == user_id).scalar() or 0
    board_count = db.query(func.count(Board.id)).filter(Board.owner_id == user_id, (Board.is_private == False) | (Board.is_private.is_(None))).scalar() or 0

    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "followers_count": followers,
        "following_count": following,
        "board_count": board_count,
        "is_following": is_following
    }

@router.post("/{user_id}/follow")
def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(Follow).filter(Follow.follower_id == current_user.id, Follow.following_id == user_id).first()
    if existing:
        return {"status": "already_following"}

    new_follow = Follow(follower_id=current_user.id, following_id=user_id)
    db.add(new_follow)
    
    # Update counts
    current_user.following_count = (current_user.following_count or 0) + 1
    target.followers_count = (target.followers_count or 0) + 1

    db.commit()
    return {"status": "success", "is_following": True}

@router.delete("/{user_id}/follow")
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Follow).filter(Follow.follower_id == current_user.id, Follow.following_id == user_id).first()
    if not existing:
        return {"status": "not_following"}

    db.delete(existing)

    target = db.query(User).filter(User.id == user_id).first()
    if target and target.followers_count and target.followers_count > 0:
        target.followers_count -= 1
    if current_user.following_count and current_user.following_count > 0:
        current_user.following_count -= 1

    db.commit()
    return {"status": "success", "is_following": False}
