from sqlalchemy import Column, Integer, String, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from database import Base

class UserStudyPattern(Base):
    __tablename__ = "user_study_patterns"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subject_exams.id"))
    correct_rate = Column(Float)
    study_time = Column(Integer)  # 학습 시간(분)
    weak_points = Column(JSON)  # 취약한 주제/개념 저장
    
    user = relationship("User", back_populates="study_patterns")
    subject = relationship("SubjectExam", back_populates="study_patterns")

class ContentRecommendation(Base):
    __tablename__ = "content_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subject_exams.id"))
    content_type = Column(String)  # "youtube", "article", "practice"
    content_url = Column(String)
    title = Column(String)
    description = Column(String)
    tags = Column(JSON)
    
    subject = relationship("SubjectExam", back_populates="recommendations") 