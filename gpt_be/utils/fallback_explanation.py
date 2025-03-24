import re
import logging

logger = logging.getLogger("fallback")

def generate_math_explanation(question, answer):
    """수학 문제에 대한 간단한 설명 생성"""
    logger.info("수학 문제에 대한 대체 설명 생성")
    
    # 이차방정식 패턴 감지
    if "이차방정식" in question and "=" in question:
        equation = re.search(r'(x\^2|x²)[\s\-\+0-9x=]*', question)
        if equation:
            return f"""
            이차방정식 문제의 풀이입니다:
            
            주어진 이차방정식의 해를 구하는 문제입니다.
            답은 {answer}입니다.
            
            일반적으로 이차방정식 ax² + bx + c = 0의 해는 근의 공식을 사용하여 구할 수 있습니다:
            x = (-b ± √(b² - 4ac)) / 2a
            
            또는 인수분해 방법으로도 풀 수 있습니다.
            """
    
    # 기본 응답
    return f"""
    문제: {question}
    답: {answer}
    
    이 문제는 기본적인 수학 개념을 적용하여 해결할 수 있습니다.
    자세한 풀이는 교과서나 참고 자료를 확인하세요.
    """

def generate_language_explanation(question, answer):
    """언어 관련 문제에 대한 간단한 설명 생성"""
    logger.info("언어 문제에 대한 대체 설명 생성")
    
    return f"""
    문제: {question}
    답: {answer}
    
    이 문제는 기본적인 언어 이해력과 문법 지식을 요구합니다.
    정확한 답변을 위해서는 관련 문법 규칙과 어휘를 학습하는 것이 중요합니다.
    """

def generate_science_explanation(question, answer):
    """과학 문제에 대한 간단한 설명 생성"""
    logger.info("과학 문제에 대한 대체 설명 생성")
    
    return f"""
    문제: {question}
    답: {answer}
    
    이 과학 문제는 기본 과학 개념에 대한 이해를 바탕으로 해결할 수 있습니다.
    관련 개념을 더 깊이 이해하기 위해 교과서나 참고 자료를 확인하세요.
    """

def generate_fallback_explanation(question, answer, subject):
    """주제에 따른 대체 설명 생성"""
    logger.info(f"{subject} 과목의 대체 설명 생성 시도")
    
    subject_lower = subject.lower() if subject else ""
    
    if "수학" in subject_lower or "math" in subject_lower:
        return generate_math_explanation(question, answer)
    elif "국어" in subject_lower or "한글" in subject_lower or "language" in subject_lower:
        return generate_language_explanation(question, answer)
    elif "과학" in subject_lower or "science" in subject_lower:
        return generate_science_explanation(question, answer)
    else:
        # 기본 설명
        return f"""
        문제: {question}
        답: {answer}
        
        이 문제는 {subject} 과목의 기본 개념을 이해하고 있어야 해결할 수 있습니다.
        정확한 풀이와 설명을 위해 관련 교과서나 참고 자료를 확인하세요.
        """ 