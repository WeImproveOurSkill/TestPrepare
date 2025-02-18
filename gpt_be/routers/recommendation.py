from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import openai

from database import get_db
from models import UserStudyPattern, ContentRecommendation, User
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
    user = db.query(User).filter(User.id == token_data.get('user_id')).first()
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
            recommendations.extend(questions)
    
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
    request: GptAssistanceRequest
) -> GptAssistanceResponse:
    # GPT API 호출
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful exam preparation assistant."},
            {"role": "user", "content": request.question}
        ]
    )
    
    return GptAssistanceResponse(
        answer=response.choices[0].message.content
    ) 