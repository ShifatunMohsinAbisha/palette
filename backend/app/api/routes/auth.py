from fastapi import APIRouter, Depends, HTTPException, Header
import os
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.follow import Follow
from app.schemas.user import UserRegister, UserLogin, UserResponse, UserUpdate, Token
from app.utils.auth import hash_password, verify_password, create_access_token, verify_token

from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str

@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        token = create_access_token({"sub": str(user.id)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token error: {type(e).__name__}: {str(e)}")
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/me", response_model=UserResponse)
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    followers = db.query(func.count(Follow.id)).filter(Follow.following_id == user.id).scalar() or 0
    following = db.query(func.count(Follow.id)).filter(Follow.follower_id == user.id).scalar() or 0
    user.followers_count = followers
    user.following_count = following
    return user

@router.put("/me", response_model=UserResponse)
def update_profile(updates: UserUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if updates.username is not None:
        existing = db.query(User).filter(User.username == updates.username, User.id != user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        user.username = updates.username
    if updates.full_name is not None:
        user.full_name = updates.full_name
    if updates.bio is not None:
        user.bio = updates.bio
    if updates.avatar_url is not None:
        user.avatar_url = updates.avatar_url
    db.commit()
    db.refresh(user)
    return user

@router.put("/change-password")
def change_password(
    req: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(req.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    if len(req.new_password) < 8 or not any(c.isdigit() for c in req.new_password):
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long and contain at least one number")
        
    user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

@router.post("/reset-password")
def reset_password(
    req: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == req.email.strip()).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email address not found")
        
    if len(req.new_password) < 8 or not any(c.isdigit() for c in req.new_password):
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long and contain at least one number")
        
    user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"message": "Password reset successfully"}