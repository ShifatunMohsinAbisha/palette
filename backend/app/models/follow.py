from sqlalchemy import Column, Integer, DateTime, UniqueConstraint
from datetime import datetime
from app.models.user import Base

class Follow(Base):
    __tablename__ = 'follows'
    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, nullable=False, index=True)
    following_id = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('follower_id', 'following_id', name='_follower_following_uc'),
    )
