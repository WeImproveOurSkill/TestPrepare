from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import openai
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

from database import get_db
from models import UserStudyPattern, ContentRecommendation, User, Question
from schemas.recommendation import (
    QuestionRecommendation,
    ContentRecommendationResponse,
    GptAssistanceRequest,
    GptAssistanceResponse
)
from utils.auth import auth_handler

router = APIRouter(prefix="/recommend", tags=["recommendations"])

# 사용자 정보를 가져오는 의존성 함수
async def get_current_user(
    db: Session = Depends(get_db),
    token_data = Depends(auth_handler.auth_wrapper)
) -> User:
    user = db.query(User).filter(User.username == token_data.get('username')).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/questions/{user_id}")
async def recommend_questions(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[QuestionRecommendation]:
    # 토큰의 사용자와 요청된 user_id가 일치하는지 확인
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
        
    study_patterns = db.query(UserStudyPattern).filter(
        UserStudyPattern.user_id == user_id
    ).all()
    
    recommendations = []
    for pattern in study_patterns:
        if pattern.correct_rate < 0.7:
            questions = db.query(Question).filter(
                Question.subject_id == pattern.subject_id,
                Question.tags.contains(pattern.weak_points)
            ).limit(5).all()
            
            recommendations.extend([
                QuestionRecommendation(
                    questionId=q.id,
                    content=q.content,
                    answer=q.answer,
                    explanation=q.explanation
                ) for q in questions
            ])
    
    return recommendations

@router.get("/content/{subject_id}")
async def recommend_content(
    subject_id: int,
    db: Session = Depends(get_db)
) -> List[ContentRecommendationResponse]:
    # YouTube 강의 및 학습 컨텐츠 추천
    recommendations = db.query(ContentRecommendation).filter(
        ContentRecommendation.subject_id == subject_id
    ).all()
    
    return recommendations

@router.post("/gpt-assistance")
async def get_gpt_assistance(
    request: GptAssistanceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> GptAssistanceResponse:
    try:
        # GPT 응답 받기
        system_prompt = f"""
        You are a helpful exam preparation assistant.
        Question: {request.content}
        Answer: {request.answer}
        
        Please provide a detailed explanation for this answer.
        User Context:
        - Subject: {request.subjectName}
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Please explain this answer in detail."}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        gpt_explanation = response.choices[0].message.content
        
        # DB에서 해당 문제 찾아서 explanation 업데이트
        question = db.query(Question).filter(Question.id == request.questionId).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
            
        question.answer.explanation = gpt_explanation
        db.commit()
        
        return GptAssistanceResponse(
            explanation=gpt_explanation
        )
    except Exception as e:
        db.rollback()  # 에러 발생 시 롤백
        raise HTTPException(
            status_code=500,
            detail=f"GPT API 호출 중 오류 발생: {str(e)}"
        ) 