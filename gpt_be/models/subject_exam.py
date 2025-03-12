from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class SubjectExam(Base):
    __tablename__ = "subject_exam"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    certification_id = Column(Integer, ForeignKey("certification.id"))

    # 관계 설정
    certification = relationship("Certification", back_populates="subject_exams")
    questions = relationship("Question", back_populates="subject_exam", cascade="all, delete-orphan") 