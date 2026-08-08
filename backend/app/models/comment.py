from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.models.user import Base

class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True, index=True)
    pin_id = Column(Integer, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    text = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
