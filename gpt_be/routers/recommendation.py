from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
import os
import logging
import traceback
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# 로거 설정
logger = logging.getLogger("recommendation")

from database import get_db
# 필요한 모델만 임포트 (ContentRecommendation 제거)
from models import Question, Answer
from schemas.recommendation import (
    QuestionRecommendation,
    ContentRecommendationResponse,
    GptAssistanceRequest,
    GptAssistanceResponse
)
# auth_handler는 현재 사용하지 않으므로 주석 처리
# from utils.auth import auth_handler
from utils.perplexity_client import perplexity_client

router = APIRouter(prefix="/recommend", tags=["recommendations"])

# 사용자 정보 관련 기능 주석 처리
"""
async def get_current_user(
    db: Session = Depends(get_db),
    token_data = Depends(auth_handler.auth_wrapper)
) -> User:
    user = db.query(User).filter(User.username == token_data.get('username')).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
"""

# study_patterns 관련 기능 주석 처리
"""
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
                Question.subject_exam_id == pattern.subject_id,
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
"""

# ContentRecommendation 엔드포인트도 주석 처리
"""
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
"""

@router.post("/gpt-assistance")
async def get_gpt_assistance(
    request: GptAssistanceRequest,
    db: Session = Depends(get_db),
) -> GptAssistanceResponse:
    try:
        # 디버깅: 요청 데이터 로깅
        logger.info(f"Received request: {request.dict()}")
        logger.info(f"API 키 상태: {'설정됨' if os.getenv('PERPLEXITY_API_KEY') else '설정되지 않음'}")
        
        # 디버깅: 환경 확인
        logger.info(f"Database URL: {os.getenv('DATABASE_URL', '직접 구성된 URL')}")
        logger.info(f"MYSQL_HOST: {os.getenv('MYSQL_HOST', 'not set')}")
        
        # Perplexity API를 사용하여 설명 생성
        perplexity_explanation = perplexity_client.generate_explanation(
            question=request.content,
            answer=request.answer,
            subject=request.subjectName
        )
        
        logger.info("Perplexity API 호출 성공")
        
        try:
            # DB 작업 활성화
            # DB에서 해당 문제와 연관된 답변 객체를 함께 조회
            logger.info(f"Question ID 조회 시작: {request.questionId}")
            question = db.query(Question).options(joinedload(Question.answer)).filter(Question.id == request.questionId).first()
            
            if not question:
                logger.warning(f"Question ID {request.questionId}에 해당하는 문제를 찾을 수 없습니다.")
                raise HTTPException(status_code=404, detail="Question not found")
            
            logger.info(f"Question 조회 성공: {question.id}")
            
            # Answer 관계가 없는 경우 새로 생성
            if not hasattr(question, 'answer') or question.answer is None:
                logger.info("Answer 객체 생성 시작")
                answer = Answer(question_id=question.id, explanation="")
                db.add(answer)
                db.flush()
                question.answer = answer
                logger.info("Answer 객체 생성 완료")
            
            # Answer 객체의 explanation 필드 업데이트
            logger.info("Answer 객체의 explanation 필드 업데이트 시작")
            question.answer.explanation = perplexity_explanation
            db.commit()
            logger.info("DB 커밋 완료")
            
        except Exception as db_error:
            logger.error(f"데이터베이스 작업 중 오류: {str(db_error)}")
            logger.error(traceback.format_exc())
            # 데이터베이스 오류 시에도 설명은 반환
            return GptAssistanceResponse(explanation=perplexity_explanation)
        
        # 생성된 explanation 반환
        return GptAssistanceResponse(
            explanation=perplexity_explanation
        )
    except Exception as e:
        logger.error(f"AI 설명 생성 중 오류: {str(e)}")
        logger.error(traceback.format_exc())
        db.rollback()  # 에러 발생 시 롤백
        raise HTTPException(
            status_code=500,
            detail=f"AI 설명 생성 중 오류 발생: {str(e)}"
        ) 