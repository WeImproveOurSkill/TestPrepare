import os
import logging
import re
from typing import Dict, List, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

logger = logging.getLogger("perplexity")

class PerplexityClient:
    """Perplexity API 클라이언트 (OpenAI 클라이언트 사용)"""
    
    def __init__(self):
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        
        if not self.api_key:
            logger.warning("PERPLEXITY_API_KEY 환경변수가 설정되지 않았습니다.")
        
        # OpenAI 클라이언트 생성 (Perplexity API는 OpenAI 호환 인터페이스 제공)
        self.client = OpenAI(
            api_key=self.api_key,
            base_url="https://api.perplexity.ai"
        )
        logger.info("Perplexity API 클라이언트(OpenAI) 초기화 완료")
    
    def generate_explanation(self, question: str, answer: str, subject: str) -> str:
        """Perplexity API를 사용하여 문제 설명 생성"""
        if not self.api_key:
            raise ValueError("PERPLEXITY_API_KEY가 설정되지 않았습니다.")
        
        system_prompt = f"""
        당신은 학생들을 위한 시험 해설가입니다. 다음 규칙을 엄격히 따라주세요:

        1. 반드시 200자 이내로 답변할 것 (매우 중요)
        2. 정답이 왜 맞는지 또는 틀린 이유를 명확하고 간결하게 설명할 것
        3. 관련된 핵심 개념만 짧게 언급할 것
        4. 다음 형식의 텍스트는 절대 사용하지 말 것:
           - 줄바꿈 문자(\n, \r\n)
           - 마크다운 강조 표시(**text**)
           - 괄호로 된 참조 번호([1], [2] 등)
           - 이스케이프 문자나 특수 서식
        5. 순수 텍스트만 사용하여 한 단락으로 작성할 것
        6. "정답은 X입니다"로 시작하지 말고 바로 설명을 시작할 것

        문제: {question}
        정답: {answer}
        과목: {subject}
        """
        
        user_prompt = "위 문제의 정답에 대한 간결한 설명을 제시된 규칙에 맞게 제공해주세요."
        
        try:
            logger.debug("Perplexity API 호출 시도")
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="sonar",  # Perplexity API에서 지원하는 모델
                max_tokens=300,  # 200자 정도면 충분
                temperature=0.5  # 더 결정적인 응답을 위해 낮춤
            )
            
            # 응답 처리
            if not response.choices or len(response.choices) == 0:
                logger.error("Perplexity API가 유효한 응답을 반환하지 않았습니다")
                return "설명을 생성하는 중 오류가 발생했습니다."
            
            logger.debug("Perplexity API 응답 받음")
            explanation = response.choices[0].message.content
            
            # 후처리: 마크다운, 특수문자, 줄바꿈 등 제거
            cleaned_explanation = self._clean_explanation(explanation)
            
            # 200자로 제한
            if len(cleaned_explanation) > 200:
                cleaned_explanation = cleaned_explanation[:197] + "..."
                
            logger.debug(f"원본 응답: {explanation}")
            logger.debug(f"정제된 응답: {cleaned_explanation}")
            
            return cleaned_explanation
            
        except Exception as e:
            # 오류 로깅 및 처리
            logger.error(f"Perplexity API 오류: {str(e)}")
            
            # 오류 메시지 파싱 (API별로 다를 수 있음)
            error_message = str(e)
            
            if hasattr(e, "response"):
                try:
                    error_data = e.response
                    if error_data and "error" in error_data:
                        error_message = error_data["error"]["message"]
                except:
                    # 오류 응답 구조가 예상과 다른 경우
                    pass
            
            # 사용자 친화적인 오류 메시지 반환
            raise ValueError(f"Perplexity API 오류: {error_message}")
    
    def _clean_explanation(self, text: str) -> str:
        """마크다운, 특수문자, 줄바꿈 등을 제거하는 함수"""
        # 줄바꿈 제거 및 여러 공백을 하나로 변환
        text = re.sub(r'\s+', ' ', text)
        
        # 마크다운 강조 표시(**) 제거
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
        
        # 참조 번호([숫자]) 제거
        text = re.sub(r'\[\d+\]', '', text)
        
        # "정답은 X입니다" 제거 시도
        text = re.sub(r'^정답은\s+.{1,10}입니다\.?\s*', '', text)
        
        # 다른 특수 서식 제거
        text = text.replace('\\n', ' ').replace('\\r', ' ')
        
        # 추가 정리 (불필요한 공백, 마침표 등)
        text = text.strip()
        
        return text

# 싱글톤 인스턴스 생성
perplexity_client = PerplexityClient() 