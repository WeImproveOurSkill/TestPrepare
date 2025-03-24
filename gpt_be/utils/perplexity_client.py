import os
import logging
import re  # 정규 표현식 모듈 추가
from dotenv import load_dotenv
from openai import OpenAI

# 환경 변수 로드
load_dotenv()

logger = logging.getLogger("perplexity")

class PerplexityClient:
    """Perplexity API 클라이언트 (OpenAI 클라이언트 사용)"""
    
    def __init__(self):
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        
        if not self.api_key:
            logger.warning("PERPLEXITY_API_KEY 환경변수가 설정되지 않았습니다.")
        else:
            # OpenAI 클라이언트 초기화
            self.client = OpenAI(
                api_key=self.api_key,
                base_url="https://api.perplexity.ai"
            )
            logger.info("Perplexity API 클라이언트(OpenAI) 초기화 완료")
    
    def generate_explanation(self, question, answer, subject_name):
        """Perplexity API를 사용하여 문제 설명 생성"""
        if not self.api_key:
            raise ValueError("PERPLEXITY_API_KEY가 설정되지 않았습니다.")
        
        # 프롬프트 구성
        system_prompt = "너는 학습을 돕는 설명 도우미야. 사용자의 질문과 정답을 바탕으로 자세한 설명을 한국어로 제공해줘."
        user_prompt = f"""
문제: {question}
정답: {answer}
과목: {subject_name}

위 문제와 정답에 대해 자세히 설명해주세요. 왜 이 답이 맞는지, 어떤 개념을 적용했는지 구체적으로 설명해주세요.
그리고 설명의 경우 200자 이내로 제한해야하며, 해설 설명시 답안에 참고한 참조 표시, \n,**, 이스케이프 문자, 기호, 강조표시 등등의 특수문자를 사용하지 말고 순수 텍스트로만 설명해줘
정답은 x번 입니다같은 답을 명세하는 내용은 뺴고 정답의 이유만 텍스트로 설명해줘.
이때 해당 정답 사항에 참조 사항같은 [1],[2],[3]...[n] 표시 텍스트는 제거하고 설명만 보내줘.
한국어로 설명해주세요.
"""
        
        # 메시지 구성
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        try:
            logger.debug("Perplexity API 호출 시도")
            
            # OpenAI 클라이언트를 통해 API 호출
            response = self.client.chat.completions.create(
                model="sonar",  # Perplexity API에서 지원하는 모델
                messages=messages,
                temperature=0.7,
                max_tokens=1024
            )
            
            # 응답에서 텍스트 추출
            explanation = response.choices[0].message.content
            
            # 참조 표시 제거 (예: [1], [2], [3] 등)
            cleaned_explanation = self._remove_reference_markers(explanation)
            
            logger.debug("Perplexity API 응답 받음")
            logger.debug(f"원본 응답: {explanation}")
            logger.debug(f"정제된 응답: {cleaned_explanation}")
            
            return cleaned_explanation
                
        except Exception as e:
            logger.error(f"Perplexity API 오류: {str(e)}")
            error_message = str(e)
            
            # 에러 타입 식별
            if "401" in error_message or "authentication" in error_message.lower():
                raise ValueError("API 키가 유효하지 않습니다.")
            elif "429" in error_message or "limit" in error_message.lower() or "quota" in error_message.lower():
                raise ValueError("API 요청 한도를 초과했습니다.")
            elif "invalid_model" in error_message.lower():
                raise ValueError(f"잘못된 모델명입니다: {error_message}")
            else:
                raise ValueError(f"Perplexity API 오류: {error_message}")
    
    def _remove_reference_markers(self, text):
        """참조 표시([1], [2], [3] 등)를 제거하는 함수"""
        # 패턴 1: [숫자] 형식 제거
        pattern1 = r'\[\d+\]'
        # 패턴 2: [숫자][숫자]... 형식 제거
        pattern2 = r'\[\d+\]\[\d+\]+'
        
        # 먼저 연속된 참조 표시 처리 (예: [1][2])
        cleaned_text = re.sub(pattern2, '', text)
        # 그 다음 개별 참조 표시 처리 (예: [1])
        cleaned_text = re.sub(pattern1, '', cleaned_text)
        
        return cleaned_text.strip()

# 싱글톤 인스턴스 생성
perplexity_client = PerplexityClient() 