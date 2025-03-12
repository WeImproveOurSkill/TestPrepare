from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    answer_text = Column(String)
    explanation = Column(Text)
    question_id = Column(Integer, ForeignKey("questions.id"))

    # 관계 설정
    question = relationship("Question", back_populates="answer") 