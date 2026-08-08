from sqlalchemy import Column, Integer, DateTime, UniqueConstraint
from datetime import datetime
from app.models.user import Base

class BoardLike(Base):
    __tablename__ = 'board_likes'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    board_id = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('user_id', 'board_id', name='_user_board_like_uc'),
    )
