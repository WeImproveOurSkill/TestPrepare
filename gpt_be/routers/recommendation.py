from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

from database import get_db
from models import UserStudyPattern, ContentRecommendation, User, Question, Answer
from schemas.recommendation import (
    QuestionRecommendation,
    ContentRecommendationResponse,
    GptAssistanceRequest,
    GptAssistanceResponse
)
from utils.auth import auth_handler
from utils.perplexity_client import perplexity_client

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
                    explanation=q.explanation,
                    subjectName=""  # 필드 추가
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
    # current_user: User = Depends(get_current_user)
) -> GptAssistanceResponse:
    try:
        # Perplexity API를 사용하여 설명 생성 (내부적으로만 변경)
        perplexity_explanation = perplexity_client.generate_explanation(
            question=request.content,
            answer=request.answer,
            subject=request.subjectName
        )
        
        # DB 관련 부분 주석 처리 (테스트용)
        '''
        # DB에서 해당 문제와 연관된 답변 객체를 함께 조회
        question = db.query(Question).options(joinedload(Question.answer)).filter(Question.id == request.questionId).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        # Answer 관계가 없는 경우 새로 생성
        if not hasattr(question, 'answer') or question.answer is None:
            answer = Answer(question_id=question.id, explanation="")
            db.add(answer)
            db.flush()
            question.answer = answer
        
        # Answer 객체의 explanation 필드 업데이트
        question.answer.explanation = perplexity_explanation
        db.commit()
        '''
        
        # 생성된 explanation만 반환
        return GptAssistanceResponse(
            explanation=perplexity_explanation
        )
    except Exception as e:
        # DB 관련 부분 주석 처리 (테스트용)
        # db.rollback()  # 에러 발생 시 롤백
        raise HTTPException(
            status_code=500,
            detail=f"AI 설명 생성 중 오류 발생: {str(e)}"
        ) 