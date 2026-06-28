from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .user import Base

class Pin(Base):
    __tablename__ = "pins"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    note = Column(String, nullable=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    created_at = Column(DateTime, default=datetime.utcnow)