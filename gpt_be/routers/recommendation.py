from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv
import logging

# 로거 설정
logger = logging.getLogger("recommendation")

# 환경변수 로드
load_dotenv()

from database import get_db
from models import UserStudyPattern, ContentRecommendation, User, Question
from schemas.recommendation import (
    QuestionRecommendation,
    ContentRecommendationResponse,
    GptAssistanceRequest,
    GptAssistanceResponse
)
from utils.fallback_explanation import generate_fallback_explanation
from utils.perplexity_client import perplexity_client

router = APIRouter(prefix="/recommend", tags=["recommendations"])

@router.get("/questions/{user_id}")
async def recommend_questions(
    user_id: int,
    db: Session = Depends(get_db)
    # 인증 의존성 제거
) -> List[QuestionRecommendation]:
    logger.info(f"사용자 {user_id}에 대한 문제 추천 요청 받음")
    
    # 데이터베이스 로직 주석 처리
    """
    logger.debug(f"사용자 {user_id}의 학습 패턴 조회")
    study_patterns = db.query(UserStudyPattern).filter(
        UserStudyPattern.user_id == user_id
    ).all()
    
    logger.debug(f"조회된 학습 패턴 수: {len(study_patterns)}")
    
    recommendations = []
    for pattern in study_patterns:
        if pattern.correct_rate < 0.7:
            logger.debug(f"약점 분야 발견: 과목 ID {pattern.subject_id}, 약점 태그 {pattern.weak_points}")
            questions = db.query(Question).filter(
                Question.subject_id == pattern.subject_id,
                Question.tags.contains(pattern.weak_points)
            ).limit(5).all()
            
            logger.debug(f"추천 문제 수: {len(questions)}")
            
            recommendations.extend([
                QuestionRecommendation(
                    questionId=q.id,
                    content=q.content,
                    answer=q.answer,
                    explanation=q.explanation
                ) for q in questions
            ])
    """
    
    # 더미 데이터 반환
    logger.info("데이터베이스 대신 더미 데이터 반환")
    recommendations = [
        QuestionRecommendation(
            questionId=1,
            content="예시 문제 1: 다음 중 올바른 것은?",
            answer="정답 1",
            explanation="이것은 예시 문제 1의 설명입니다."
        ),
        QuestionRecommendation(
            questionId=2,
            content="예시 문제 2: 다음 중 틀린 것은?",
            answer="정답 2",
            explanation="이것은 예시 문제 2의 설명입니다."
        )
    ]
    
    logger.info(f"총 {len(recommendations)}개 문제 추천 완료")
    return recommendations

@router.get("/content/{subject_id}")
async def recommend_content(
    subject_id: int,
    db: Session = Depends(get_db)
) -> List[ContentRecommendationResponse]:
    # YouTube 강의 및 학습 컨텐츠 추천
    logger.info(f"과목 ID {subject_id}에 대한 콘텐츠 추천 요청 받음")
    
    # 데이터베이스 로직 주석 처리
    """
    recommendations = db.query(ContentRecommendation).filter(
        ContentRecommendation.subject_id == subject_id
    ).all()
    """
    
    # 더미 데이터 반환
    logger.info("데이터베이스 대신 더미 데이터 반환")
    recommendations = [
        ContentRecommendationResponse(
            id=1,
            content_type="youtube",
            content_url="https://www.youtube.com/watch?v=example1",
            title="예시 강의 1",
            description="이것은 예시 강의 1의 설명입니다.",
            tags=["태그1", "태그2"]
        ),
        ContentRecommendationResponse(
            id=2,
            content_type="article",
            content_url="https://www.example.com/article1",
            title="예시 아티클 1",
            description="이것은 예시 아티클 1의 설명입니다.",
            tags=["태그3", "태그4"]
        )
    ]
    
    logger.info(f"총 {len(recommendations)}개 콘텐츠 추천 완료")
    return recommendations

@router.post("/gpt-assistance")
async def get_gpt_assistance(
    request: GptAssistanceRequest,
    db: Session = Depends(get_db)
    # 사용자 인증 의존성 제거
) -> GptAssistanceResponse:
    logger.info(f"Perplexity 도움말 요청 받음: 문제 ID {request.questionId}")
    
    try:
        # Perplexity API 키 확인
        api_key = os.getenv("PERPLEXITY_API_KEY")
        if not api_key:
            logger.error("PERPLEXITY_API_KEY 환경변수가 설정되지 않았습니다.")
            # 대체 설명 생성
            fallback_explanation = generate_fallback_explanation(
                request.content, request.answer, request.subjectName
            )
            return GptAssistanceResponse(
                explanation=f"API 키가 설정되지 않아 Perplexity 설명을 생성할 수 없습니다. 대신 기본 설명을 제공합니다.\n\n{fallback_explanation}"
            )
            
        # Perplexity API 호출
        logger.debug("Perplexity API 호출 시도")
        use_fallback = False
        try:
            # Perplexity 클라이언트를 사용하여 설명 생성
            explanation = perplexity_client.generate_explanation(
                request.content, 
                request.answer, 
                request.subjectName
            )
            logger.debug("Perplexity API 응답 받음")
        except ValueError as e:
            # API 오류 처리
            error_message = str(e)
            logger.error(f"Perplexity API 오류: {error_message}")
            use_fallback = True
            
            # 대체 설명 생성
            fallback_explanation = generate_fallback_explanation(
                request.content, request.answer, request.subjectName
            )
            
            if "API 키가 유효하지 않습니다" in error_message:
                explanation = f"API 키 오류가 발생했습니다. 대신 기본 설명을 제공합니다.\n\n{fallback_explanation}"
            elif "API 요청 한도를 초과했습니다" in error_message:
                explanation = f"죄송합니다. 현재 API 사용량이 한도를 초과하여 Perplexity 설명을 생성할 수 없습니다. 대신 기본 설명을 제공합니다.\n\n{fallback_explanation}"
            else:
                explanation = f"Perplexity API 오류가 발생했습니다. 대신 기본 설명을 제공합니다.\n\n{fallback_explanation}"
        
        # DB에서 해당 문제 찾아서 explanation 업데이트
        # API 오류로 대체 설명을 사용할 경우 DB 저장은 건너뜁니다
        # 데이터베이스 관련 코드 주석 처리
        """
        if not use_fallback:
            logger.debug(f"문제 ID {request.questionId} 조회")
            question = db.query(Question).filter(Question.id == request.questionId).first()
            if not question:
                logger.error(f"문제 ID {request.questionId} 조회 실패: 해당 문제 없음")
                raise HTTPException(status_code=404, detail="Question not found")
                
            # 답변 explanation 필드가 있는지 확인
            if hasattr(question, "answer") and question.answer is not None:
                question.answer.explanation = explanation
                logger.debug("DB 업데이트 시도")
                db.commit()
                logger.info("Perplexity 설명 저장 및 응답 완료")
            else:
                logger.warning(f"문제 ID {request.questionId}에 answer 관계가 없거나 null입니다. DB 저장을 건너뜁니다.")
        """
        
        # 데이터베이스 저장 대신 로그만 남김
        logger.info("데이터베이스 저장 과정을 건너뛰고 결과 반환")
        
        return GptAssistanceResponse(
            explanation=explanation
        )
    except Exception as e:
        logger.error(f"Perplexity API 호출 오류: {str(e)}")
        # db.rollback() 주석 처리  # 에러 발생 시 롤백
        
        # 다양한 예외 처리 - 사용자에게 친숙한 오류 메시지 반환
        error_message = str(e)
        
        # 대체 설명 생성
        fallback_explanation = generate_fallback_explanation(
            request.content, request.answer, request.subjectName
        )
        
        return GptAssistanceResponse(
            explanation=f"죄송합니다. 설명을 생성하는 동안 오류가 발생했습니다. 대신 기본 설명을 제공합니다.\n\n{fallback_explanation}"
        ) 