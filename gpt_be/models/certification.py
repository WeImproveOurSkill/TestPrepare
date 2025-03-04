from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Certification(Base):
    __tablename__ = "certification"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    year = Column(Integer)
    session = Column(String)

    # 관계 설정
    subject_exams = relationship("SubjectExam", back_populates="certification", cascade="all, delete-orphan") 