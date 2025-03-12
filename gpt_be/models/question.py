from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)  # 문제 내용과 선택지를 포함한 전체 내용
    image_link = Column(String)
    subject_id = Column(Integer, ForeignKey("subject_exam.id"))

    # 관계 설정
    subject_exam = relationship("SubjectExam", back_populates="questions")
    answer = relationship("Answer", back_populates="question", uselist=False, cascade="all, delete-orphan")

    def get_choices(self):
        if self.content:
            return self.content.replace(".*?(?=1\\)|$)", "")
        return None

    def get_question_content(self):
        if self.content:
            return self.content.replace("(?:1\\)|2\\)|3\\)|4\\)|5\\)).*", "").strip()
        return None 