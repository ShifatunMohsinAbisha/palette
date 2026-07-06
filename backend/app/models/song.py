from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from .user import Base

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    artwork_url = Column(String, nullable=True)
    youtube_id = Column(String, nullable=False)
    duration = Column(String, nullable=True)
    mood = Column(String, nullable=True)
    color = Column(String, nullable=True)
    emoji = Column(String, nullable=True)
    position = Column(Integer, default=0, nullable=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
