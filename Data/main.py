import os
import re
import sqlite3
import mysql.connector
import pypdf
import pdfplumber
from dataclasses import dataclass, field
from typing import List, Optional
import io
from PIL import Image
import uuid  # UUID 모듈 추가

@dataclass
class Answer:
    id: Optional[int] = None
    answer_text: str = ""  # BE 프로젝트의 answerText 필드와 일치하도록 유지
    explanation: str = "not have explanation"
    question: Optional['Question'] = None

    def __str__(self) -> str:
        return f"""
        [답안 정보]
        - 답안: {self.answer_text}
        - 해설: {self.explanation}
        """

@dataclass
class Question:
    id: Optional[int] = None
    content: str = ""
    image_link: Optional[str] = None  # imageLink → image_link 변경
    subject_exam: Optional['SubjectExam'] = None
    certification_type: Optional['CertificationType'] = None  # CertificationType과의 연관관계 추가
    answer: Optional[Answer] = None

    def __str__(self) -> str:
        return f"""
        [문제 정보]
        - 내용: {self.content[:100]}...
        - 이미지: {self.image_link if self.image_link else '없음'}
        - 회차: {f"{self.certification_type.year}년 {self.certification_type.session}회" if self.certification_type else '미지정'}
        {self.answer if self.answer else '- 답안 정보 없음'}
        """

    def get_choices(self) -> Optional[str]:
        if self.content:
            return re.sub(r".*?(?=1\)|$)", "", self.content)
        return None

    def get_question_content(self) -> Optional[str]:
        if self.content:
            return re.sub(r"(?:1\)|2\)|3\)|4\)|5\)).*", "", self.content).strip()
        return None

@dataclass
class SubjectExam:
    id: Optional[int] = None
    name: str = ""
    certification: Optional['Certification'] = None
    questions: List[Question] = None
    certification_subjects: List['CertificationSubject'] = None

    def __post_init__(self):
        if self.questions is None:
            self.questions = []
        if self.certification_subjects is None:
            self.certification_subjects = []

    def __str__(self) -> str:
        return f"""
        [과목 정보]
        - 과목명: {self.name}
        - 문제 수: {len(self.questions)}
        """

@dataclass
class Certification:
    id: Optional[int] = None
    name: str = ""
    subject_exams: List[SubjectExam] = None
    certification_types: List['CertificationType'] = None

    def __post_init__(self):
        if self.subject_exams is None:
            self.subject_exams = []
        if self.certification_types is None:
            self.certification_types = []

    def __str__(self) -> str:
        return f"""
        [자격증 정보]
        - 자격증명: {self.name}
        - 유형 수: {len(self.certification_types)}
        - 과목 수: {len(self.subject_exams)}
        """

@dataclass
class CertificationType:
    id: Optional[int] = None
    year: int = 0  # 시험 년도
    session: int = 0  # 시험 회차 (int로 변경)
    certification: Optional[Certification] = None
    certification_subjects: List['CertificationSubject'] = None
    questions: List[Question] = None  # Question과의 연관관계 추가

    def __post_init__(self):
        if self.certification_subjects is None:
            self.certification_subjects = []
        if self.questions is None:
            self.questions = []

    def __str__(self) -> str:
        return f"""
        [자격증 시험 유형]
        - 자격증: {self.certification.name if self.certification else '미지정'}
        - 년도: {self.year}
        - 회차: {self.session}
        - 문제 수: {len(self.questions)}
        """

@dataclass
class CertificationSubject:
    id: Optional[int] = None
    certification_type: Optional[CertificationType] = None
    subject_exam: Optional[SubjectExam] = None

    def __str__(self) -> str:
        return f"""
        [자격증-과목 관계]
        - 자격증 유형: {self.certification_type.certification.name if self.certification_type and self.certification_type.certification else '미지정'} {self.certification_type.year}년 {self.certification_type.session}회
        - 과목: {self.subject_exam.name if self.subject_exam else '미지정'}
        """
        
def drop_tables(db):
    """기존 테이블 삭제"""
    cursor = db.cursor()
    
    # 외래 키 제약 조건 일시 비활성화
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
    
    tables = [
        "answers",
        "user_question",  # 추가: 먼저 삭제해야 함
        "questions",
        "certification_subject",
        "subject_exam",
        "certification_type",
        "certification"
    ]
    
    print("\n기존 테이블 삭제 시작...")
    for table in tables:
        try:
            cursor.execute(f"DROP TABLE IF EXISTS {table}")
            print(f"테이블 삭제 완료: DROP TABLE IF EXISTS {table}")
        except Exception as e:
            print(f"테이블 삭제 중 오류 발생: {e}")
    
    # 외래 키 제약 조건 다시 활성화
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
    
    print("모든 테이블이 성공적으로 삭제되었습니다.")
    cursor.close()

def create_tables(db):
    """필요한 테이블 생성"""
    cursor = db.cursor()
    
    # 인증 테이블 (자격증 정보) - Certification 엔티티와 일치
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS certification (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,  # 타입을 BIGINT로 변경
        name VARCHAR(255) NOT NULL
    )
    """)
    
    # 자격증 유형 테이블 - CertificationType 엔티티와 일치
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS certification_type (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,  # 타입을 BIGINT로 변경
        year INT NOT NULL,
        session INT NOT NULL,
        certification_id BIGINT NOT NULL,  # 타입을 BIGINT로 변경
        FOREIGN KEY (certification_id) REFERENCES certification(id)
    )
    """)
    
    # 과목 테이블 - SubjectExam 엔티티와 일치
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subject_exam (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,  # 타입을 BIGINT로 변경
        name VARCHAR(255) NOT NULL,
        certification_id BIGINT NOT NULL,  # 타입을 BIGINT로 변경
        FOREIGN KEY (certification_id) REFERENCES certification(id)
    )
    """)
    
    # 자격증-과목 연결 테이블 - CertificationSubject 엔티티와 일치
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS certification_subject (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,  # 타입을 BIGINT로 변경
        certification_type_id BIGINT NOT NULL,  # 타입을 BIGINT로 변경
        subject_exam_id BIGINT NOT NULL,  # 타입을 BIGINT로 변경
        FOREIGN KEY (certification_type_id) REFERENCES certification_type(id),
        FOREIGN KEY (subject_exam_id) REFERENCES subject_exam(id)
    )
    """)
    
    # 문제 테이블 - Question 엔티티와 일치
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,  # 타입을 BIGINT로 변경
        content TEXT NOT NULL,
        image_link VARCHAR(255),
        subject_exam_id BIGINT NOT NULL,  # 타입을 BIGINT로 변경
        certification_type_id BIGINT NOT NULL,  # CertificationType과의 연관관계 추가
        FOREIGN KEY (subject_exam_id) REFERENCES subject_exam(id),
        FOREIGN KEY (certification_type_id) REFERENCES certification_type(id)
    )
    """)
    
    # 답변 테이블 - Answer 엔티티와 일치
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS answers (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,  # 타입을 BIGINT로 변경
        answer_text VARCHAR(255) NOT NULL,
        explanation TEXT,
        question_id BIGINT NOT NULL,  # 타입을 BIGINT로 변경
        UNIQUE KEY unique_question_id (question_id),
        FOREIGN KEY (question_id) REFERENCES questions(id)
    )
    """)
    
    # user_question 테이블 스키마 추가 (이미 존재하는 테이블이라면)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_question (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        question_id BIGINT NOT NULL,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (question_id) REFERENCES questions(id)
    )
    """)
    
    print("필요한 테이블이 성공적으로 생성되었습니다.")
    cursor.close()

def parse_filename(filename: str) -> tuple[str, int, str, Optional[str]]:
    """파일명에서 자격증 정보와 과목 정보 추출"""
    # 기본값 설정
    cert_name = "정보처리기사"  # 대부분 정보처리기사이므로 기본값 설정
    year = 2024
    session = "1회"
    subject = None
    
    # 자격증 이름 매핑
    cert_names = {
        '네트워크관리사': '네트워크관리사',
        '리눅스마스터': '리눅스마스터',
        '정보보안기사': '정보보안기사',
        '정보처리기사': '정보처리기사',
        '정보처리산업기사': '정보처리산업기사',
        '기사필기': '정보처리기사'  # 새로운 형식 추가
    }
    
    filename_lower = filename.lower()
    
    # 자격증 이름 추출
    for key, value in cert_names.items():
        if key in filename_lower:
            cert_name = value
            break
    
    # 년도 추출
    year_match = re.search(r'20\d{2}', filename)
    if year_match:
        year = int(year_match.group())
    
    # 회차 추출 - 여러 형식 지원
    session_patterns = [
        r'(\d+)\s*회',  # "1회", "1 회" 형식
        r'(\d+)회차',   # "1회차" 형식
        r'(\d+)\s*[차회]', # "1차", "1 차" 형식
        r'[년]\s*(\d+)\s*[회차]', # "2023년 1회", "2023년1회" 형식
        r'[^0-9](\d)[^0-9]'  # "1. ", "2. " 등 번호 형식
    ]
    
    for pattern in session_patterns:
        match = re.search(pattern, filename)
        if match:
            session = f"{match.group(1)}회"
            break
    
    # 과목 추출 (있는 경우)
    subject_patterns = [
        r'(\w+)과목',
        r'(\w+)_과목',
        r'과목_?(\w+)',
        r'과목[\-_]?(\w+)'
    ]
    
    for pattern in subject_patterns:
        match = re.search(pattern, filename_lower)
        if match:
            subject = match.group(1)
            break
    
    return cert_name, year, session, subject

def detect_subject_change(content: str) -> Optional[str]:
    """문제 내용에서 과목 변경 패턴 감지"""
    # 과목 변경을 나타내는 다양한 패턴 시도
    patterns = [
        r'^\s*(?:\[|【)\s*([^】\]]+)\s*(?:\]|】)\s*$',
        r'^\s*(?:\<|《)\s*([^》\>]+)\s*(?:\>|》)\s*$',
        r'^\s*==+\s*([^=]+)\s*==+\s*$',
        r'^\s*\*\*+\s*([^*]+)\s*\*\*+\s*$',
        r'^\s*--+\s*([^-]+)\s*--+\s*$',
        r'^\s*◆+\s*([^◆]+)\s*◆+\s*$',
        r'^\s*■+\s*([^■]+)\s*■+\s*$',
        r'^\s*□+\s*([^□]+)\s*□+\s*$',
        r'^\s*▣+\s*([^▣]+)\s*▣+\s*$',
        r'^\s*▶+\s*([^▶]+)\s*◀+\s*$',
        r'^\s*▷+\s*([^◁]+)\s*◁+\s*$',
        r'^\s*★+\s*([^★]+)\s*★+\s*$',
        r'^\s*☆+\s*([^☆]+)\s*☆+\s*$',
        r'^\s*○+\s*([^○]+)\s*○+\s*$',
        r'^\s*●+\s*([^●]+)\s*●+\s*$',
        r'^\s*과\s*목\s*:\s*(.+)$',
        r'^\s*과목명\s*:\s*(.+)$',
        r'^\s*Part\s*\d+[\.:]?\s*(.+)$',
        r'^\s*Section\s*\d+[\.:]?\s*(.+)$',
        r'^\s*Chapter\s*\d+[\.:]?\s*(.+)$'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content, re.MULTILINE)
        if match:
            subject = match.group(1).strip()
            if len(subject) > 1 and len(subject) < 50:  # 합리적인 길이 제한
                return subject
    
    return None

class PDFExtractor:
    """PDF 파일에서 문제와 선택지를 포함한 내용을 추출하는 클래스"""
    
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.cert_name, self.year, self.session, self.subject = parse_filename(os.path.basename(pdf_path))
    
    def _extract_answer_grid(self, page):
        """테이블 그리드 형식의 정답표에서 정답 추출 (10x10 정답표)"""
        answer_dict = {}
        
        try:
            text = page.extract_text() or ""
            lines = text.splitlines()
            
            # 정답표 헤더 찾기
            header_index = -1
            for i, line in enumerate(lines):
                if "정답" in line and ("해설" in line or "및" in line):
                    header_index = i
                    print(f"정답표 헤더 발견: '{line}'")
                    break
            
            if header_index == -1:
                print("정답표 헤더를 찾을 수 없음")
                return {}
            
            # 정답표 행 분석 (10x10 그리드 형태)
            grid_rows = []
            current_row = []
            in_grid = False
            
            # 헤더 이후 행을 확인
            for i in range(header_index + 1, min(header_index + 20, len(lines))):
                line = lines[i].strip()
                
                # 빈 줄이면 건너뛰기
                if not line:
                    continue
                
                # 10개씩 그룹화된 번호와 정답 패턴 찾기
                matches = re.findall(r'(\d+)[\.\s]*([①②③④⑤])', line)
                
                # 한 줄에 여러 문제 정답이 있으면 그리드 형태로 간주
                if len(matches) >= 3:
                    in_grid = True
                    current_row = matches
                    grid_rows.append(current_row)
                    print(f"정답 그리드 행 발견: {len(matches)}개 항목")
                
                # 그리드를 벗어났으면 중단
                elif in_grid:
                    break
            
            # 그리드에서 정답 추출
            for row in grid_rows:
                for match in row:
                    try:
                        q_num = int(match[0])
                        ans = match[1]
                        if 1 <= q_num <= 100:  # 유효한 문제 번호 범위
                            answer_dict[q_num] = ans
                    except:
                        continue
                    
            # 정답 검증
            if len(answer_dict) >= 80:  # 80% 이상 추출 성공
                print(f"그리드 형식에서 {len(answer_dict)}개 정답 추출 성공")
            else:
                print(f"그리드 형식 추출 결과 부족: {len(answer_dict)}개")
            
            return answer_dict
            
        except Exception as e:
            print(f"정답 그리드 추출 중 오류: {e}")
            return {}

    def extract_questions(self):
        """PDF에서 문제와, 선택지, 답안을 추출"""
        questions = []
        
        try:
            # pdfplumber로 PDF 열기
            with pdfplumber.open(self.pdf_path) as pdf:
                # 정답 페이지 찾기
                answer_page = self._find_answer_page(pdf)
                
                # 정답 정보 추출 시도
                # 1. 먼저 그리드 형식 시도
                answer_dict = self._extract_answer_grid(answer_page)
                
                # 2. 그리드 방식으로 충분한 정답을 추출하지 못했으면 일반 방식 시도
                if len(answer_dict) < 80:  # 80% 미만이면 일반 방식 시도
                    alt_answers = self._extract_answer_table(answer_page)
                    if len(alt_answers) > len(answer_dict):
                        print(f"일반 방식으로 {len(alt_answers)}개 정답 추출 성공")
                        answer_dict = alt_answers
                
                # 3. 여전히 부족하면 가로/세로 분할 방식 시도
                if len(answer_dict) < 80:
                    split_answers = self._extract_answer_table_split(answer_page)
                    if len(split_answers) > len(answer_dict):
                        print(f"분할 방식으로 {len(split_answers)}개 정답 추출 성공")
                        answer_dict = split_answers
                
                print(f"최종 추출된 정답 수: {len(answer_dict)}")
                
                # 정답 샘플 출력
                if answer_dict:
                    sample_keys = sorted(list(answer_dict.keys()))[:5]
                    sample_answers = [(k, answer_dict[k]) for k in sample_keys]
                    print(f"정답 샘플: {sample_answers}")
                
                # 임시로 문제 번호와 내용을 저장할 리스트
                temp_questions = []
                
                # 일반 문제 추출 진행 (정답 페이지 제외)
                for page_num in range(len(pdf.pages)):
                    page = pdf.pages[page_num]
                    if page == answer_page:
                        print(f"페이지 {page_num+1}는 정답 페이지로 건너뜁니다.")
                        continue
                    
                    print(f"페이지 {page_num+1} 처리 중...")
                    
                    # 페이지 크기 가져오기
                    width = page.width
                    height = page.height
                    
                    # 좌측 영역 크롭
                    left_crop = page.crop((0, 0, width/2, height))
                    left_text = left_crop.extract_text() or ""
                    
                    # 우측 영역 크롭
                    right_crop = page.crop((width/2, 0, width, height))
                    right_text = right_crop.extract_text() or ""
                    
                    # 좌측 문제 처리
                    if left_text.strip():
                        left_questions = self._extract_complete_questions(left_text)
                        if left_questions:
                            temp_questions.extend(left_questions)
                            print(f"좌측에서 {len(left_questions)}개 문제 추출")
                    
                    # 우측 문제 처리
                    if right_text.strip():
                        right_questions = self._extract_complete_questions(right_text)
                        if right_questions:
                            temp_questions.extend(right_questions)
                            print(f"우측에서 {len(right_questions)}개 문제 추출")
                
                print(f"총 {len(temp_questions)}개의 문제가 추출되었습니다.")
                
                # 정답과 매칭하여 최종 문제 리스트 생성
                for q in temp_questions:
                    q_num = q.get('number')
                    if q_num in answer_dict:
                        answer_text = answer_dict[q_num]
                        questions.append({
                            'text': q.get('content'),
                            'image_link': 'not-image',
                            'answer': answer_text,
                            'question_number': q_num
                        })
                    else:
                        print(f"경고: 문제 {q_num}의 정답을 찾을 수 없습니다.")
                        # 정답이 없어도 문제는 저장 (선택적)
                        questions.append({
                            'text': q.get('content'),
                            'image_link': 'not-image',
                            'answer': None, 
                            'question_number': q_num
                        })
                
                # 정답 연결 통계
                questions_with_answers = sum(1 for q in questions if q.get('answer') is not None)
                print(f"정답이 연결된 문제: {questions_with_answers}/{len(questions)} ({questions_with_answers/len(questions)*100:.1f}%)")
                
                # 정답 없는 문제 번호 목록
                missing_answers = [q.get('question_number') for q in questions if q.get('answer') is None]
                if missing_answers:
                    print(f"정답 없는 문제 번호 (최대 10개): {missing_answers[:10]}")
                    if len(missing_answers) > 10:
                        print(f"... 외 {len(missing_answers)-10}개")
                
                return questions
                
        except Exception as e:
            print(f"PDF 추출 중 오류 발생: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def _extract_complete_questions(self, page_text):
        """텍스트를 문제 단위로 분리하고 파싱"""
        questions = []
        
        # 페이지 텍스트 전처리
        page_text = self._clean_question_text(page_text)
        
        # 문제 블록 단위로 분리
        question_blocks = self._split_into_question_blocks(page_text)
        
        for block in question_blocks:
            question = self._parse_question_block(block)
            if question:
                questions.append(question)
        
        return questions
    
    def _split_into_question_blocks(self, text):
        """텍스트를 문제 단위로 분리"""
        # 문제 번호로 시작하는 패턴으로 분리
        blocks = re.split(r'(?=^\s*\d+\.)', text, flags=re.MULTILINE)
        # 빈 블록 제거하고 공백 정리
        return [b.strip() for b in blocks if b.strip()]
    
    def _parse_question_block(self, block):
        """문제 블록에서 문제 번호, 내용 추출"""
        try:
            # 문제 번호와 내용 분리
            match = re.match(r'^\s*(\d+)\.\s*(.+)', block, re.DOTALL)
            if not match:
                return None
                
            question_num = int(match.group(1))
            question_content = match.group(2).strip()
            
            # 내용이 너무 짧으면 건너뜀
            if len(question_content) < 5:
                print(f"경고: 문제 {question_num}의 내용이 너무 짧습니다")
                return None
            
            return {
                'number': question_num,
                'content': question_content
            }
            
        except Exception as e:
            print(f"문제 파싱 중 오류 발생: {e}")
            return None
    
    def _clean_question_text(self, text):
        """문제 텍스트 전처리"""
        # 1. 기본 텍스트 정리
        text = text.strip()
        
        # 2. 연속된 공백을 하나로 줄이되, 줄바꿈은 보존
        text = re.sub(r'[^\S\n]+', ' ', text)
        
        # 3. 불필요한 줄바꿈 제거
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        # 4. 문제 번호 형식 통일
        text = re.sub(r'(\d+)\)\s*', r'\1. ', text)
        
        # 5. 선택지 구분 및 형식 통일
        # 원형 숫자 선택지 처리
        text = re.sub(r'([①②③④⑤])', r'\n\1', text)
        
        # 괄호 숫자 선택지 처리
        text = re.sub(r'(\([1-5]\))', r'\n\1', text)
        
        # 문제 내용이 "번호." 다음 내용이 잘 분리되도록
        text = re.sub(r'(\d+\.\s*)([^\n])', r'\1 \2', text)
        
        # Coad와 Yourdon 같은 특수 케이스 처리
        text = re.sub(r'([A-Za-z]+)[와과]\s+([A-Za-z]+)\s+방법', r'\1와 \2 방법', text)
        
        # 괄호 안의 숫자 선택지 처리
        text = re.sub(r'\(\s*(\d)\s*\)', r'(\1)', text)
        
        return text
    
    def _find_answer_page(self, pdf):
        """정답 테이블이 있는 페이지 찾기"""
        answer_page_candidates = []
        
        # 1. 모든 페이지에 대해 정답표 점수 계산
        for i in range(len(pdf.pages)):
            page = pdf.pages[i]
            text = page.extract_text() or ""
            
            # 점수 초기화
            score = 0
            
            # 정답 관련 키워드 확인
            for keyword in ["정답", "정답표", "정답 및 해설"]:
                if keyword in text:
                    score += 10
                    print(f"페이지 {i+1}: '{keyword}' 발견 (+10점)")
            
            # 표 형태 패턴 점수 (정답표 형식)
            table_pattern = r'\d+[\.\s]*[①②③④⑤]'
            table_matches = re.findall(table_pattern, text)
            
            if len(table_matches) > 0:
                # 테이블형 패턴의 수에 비례하여 점수 부여
                pattern_score = min(50, len(table_matches) * 0.5)  # 최대 50점
                score += pattern_score
                print(f"페이지 {i+1}: {len(table_matches)}개의 정답표 패턴 발견 (+{pattern_score:.1f}점)")
            
            # 행/열 구조 확인 (표 구조)
            lines = text.splitlines()
            row_count = 0
            
            # 연속된 행에서 숫자.원형숫자 패턴 확인
            for line in lines:
                if re.search(r'\d+[\.\s]*[①②③④⑤]', line):
                    row_count += 1
                    # 연속된 행이 많을수록 표일 가능성 높음
                    if row_count >= 3:
                        score += 15
                        print(f"페이지 {i+1}: 연속된 정답 행 구조 발견 (+15점)")
                        break
            
            # "1.① 2.② 3.①" 등의 형식이 있는지 확인
            if re.search(r'(\d+[\.\s]*[①②③④⑤]\s*){5,}', text):
                score += 20
                print(f"페이지 {i+1}: 일렬로 나열된 정답 패턴 발견 (+20점)")
            
            # 이미지에서 본 것과 같은 정답표 헤더 확인
            if re.search(r'정답\s*및\s*해설', text, re.IGNORECASE):
                score += 30
                print(f"페이지 {i+1}: '정답 및 해설' 헤더 발견 (+30점)")
            
            # 후보 페이지로 추가
            answer_page_candidates.append((i, page, score))
            print(f"페이지 {i+1} 총점: {score}")
        
        # 점수 기준으로 정렬
        answer_page_candidates.sort(key=lambda x: x[2], reverse=True)
        
        # 최고 점수 페이지 선택
        if answer_page_candidates and answer_page_candidates[0][2] > 0:
            best_page_index, best_page, score = answer_page_candidates[0]
            print(f"정답표로 {best_page_index+1}페이지 선택 (점수: {score})")
            return best_page
        
        # 적절한 페이지를 찾지 못한 경우 마지막 페이지 반환
        print("적절한 정답표 페이지를 찾지 못해 마지막 페이지 선택")
        return pdf.pages[-1]
    
    def _extract_answer_table(self, page):
        """정답표에서 정답 추출 - 테이블 형식의 정답표 처리에 최적화"""
        answer_dict = {}
        
        try:
            text = page.extract_text() or ""
            
            # "정답 및 해설" 또는 유사 문구가 있는지 확인
            has_answer_header = False
            answer_headers = ["정답 및 해설", "정답표", "정 답", "정답"]
            
            for header in answer_headers:
                if header in text:
                    has_answer_header = True
                    print(f"정답표 헤더 '{header}' 발견")
                    break
            
            # 테이블 형태의 정답 추출 패턴 - 번호.원형숫자 형식에 최적화
            table_pattern = r'(\d+)[\.\s]*([①②③④⑤])'
            table_matches = re.findall(table_pattern, text)
            
            if table_matches:
                print(f"테이블 형식 정답 패턴 {len(table_matches)}개 발견")
                for match in table_matches:
                    q_num = int(match[0])
                    ans = match[1]
                    answer_dict[q_num] = ans
            
            # 표가 아닌 형식으로 나열된 경우 (예: 1.① 2.② ...)
            if len(answer_dict) < 20:
                linear_pattern = r'(\d+)[.]\s*([①②③④⑤])'
                linear_matches = re.findall(linear_pattern, text)
                for match in linear_matches:
                    q_num = int(match[0])
                    ans = match[1]
                    if q_num not in answer_dict:  # 중복 방지
                        answer_dict[q_num] = ans
            
            # 테이블에서 번호와 숫자로 표현된 정답 처리 (1.1, 2.3 등)
            if len(answer_dict) < 20:
                num_pattern = r'(\d+)[\.\s]*([1-5])'
                num_matches = re.findall(num_pattern, text)
                
                for match in num_matches:
                    q_num = int(match[0])
                    ans_num = int(match[1])
                    
                    # 숫자를 원형 숫자로 변환 (1->①, 2->② 등)
                    if 1 <= ans_num <= 5:
                        ans = "①②③④⑤"[ans_num-1]
                        if q_num not in answer_dict:  # 중복 방지
                            answer_dict[q_num] = ans
            
            # 테이블 구조를 인식하여 행과 열로 처리
            if len(answer_dict) < 20:
                # 10x10 테이블 행 구조
                lines = text.splitlines()
                table_start_line = -1
                
                # 테이블의 시작 위치 찾기
                for i, line in enumerate(lines):
                    if '정답' in line or '해설' in line:
                        table_start_line = i + 1
                        break
                
                # 테이블이 감지되면
                if table_start_line > 0 and table_start_line < len(lines):
                    for i in range(table_start_line, min(table_start_line + 15, len(lines))):
                        line = lines[i]
                        # 테이블 행에서 번호와 정답 추출
                        row_matches = re.findall(r'(\d+)[.·\s]*([①②③④⑤])', line)
                        if row_matches:
                            for match in row_matches:
                                q_num = int(match[0])
                                ans = match[1]
                                if 1 <= q_num <= 100:  # 유효한 문제 번호 범위
                                    answer_dict[q_num] = ans
            
            # 정답이 모두 추출되었는지 검증
            expected_count = 100  # 보통 시험은 100문제
            if len(answer_dict) < expected_count * 0.8:  # 80% 미만이면 경고
                print(f"경고: 예상 문제 수({expected_count})의 {len(answer_dict) / expected_count * 100:.1f}%만 추출됨")
                
                # 추가 디버깅 정보
                print(f"추출된 정답 범위: {min(answer_dict.keys()) if answer_dict else 'N/A'} ~ {max(answer_dict.keys()) if answer_dict else 'N/A'}")
                
                # 정답이 부족하면 텍스트 내용 확인
                if len(text) < 100:
                    print("텍스트가 너무 짧음. 페이지 추출에 문제가 있을 수 있음")
                elif len(text) > 1000:
                    print(f"텍스트 길이: {len(text)} - 처음 100자: {text[:100]}")
            
            return answer_dict
            
        except Exception as e:
            print(f"정답표 추출 중 오류 발생: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    def _extract_answer_table_split(self, page):
        """마지막 페이지를 좌우로 분할하여 정답 추출 시도"""
        answer_dict = {}
        
        try:
            # 페이지 크기 가져오기
            width = page.width
            height = page.height
            
            # 좌측 영역 크롭
            left_crop = page.crop((0, 0, width/2, height))
            left_text = left_crop.extract_text() or ""
            
            # 우측 영역 크롭
            right_crop = page.crop((width/2, 0, width, height))
            right_text = right_crop.extract_text() or ""
            
            # 다양한 정답 패턴
            patterns = [
                r'(\d+)[\.\s]*([①②③④])',           # 1.① 형식
                r'(\d+)[\.\s]*(\d)',                # 1.1 형식
                r'(\d+)[\.\s]*([A-D])',             # 1.A 형식
                r'(\d+)[\.]\s*\(\s*([1-4])\s*\)',   # 1.(1) 형식
                r'(\d+)[\.]\s*([1-4])',             # 1.1 형식
            ]
            
            # 좌측 영역 처리
            if left_text:
                for pattern in patterns:
                    matches = re.findall(pattern, left_text)
                    for match in matches:
                        try:
                            q_num = int(match[0])
                            ans = match[1]
                            
                            # 숫자 정답을 원형 숫자로 변환
                            if ans.isdigit():
                                idx = int(ans) - 1
                                if 0 <= idx <= 3:
                                    ans = "①②③④"[idx]
                            
                            # 알파벳 정답을 원형 숫자로 변환
                            elif ans in 'ABCD':
                                idx = ord(ans) - ord('A')
                                ans = "①②③④"[idx]
                            
                            answer_dict[q_num] = ans
                        except:
                            pass
            
            # 우측 영역 처리
            if right_text:
                for pattern in patterns:
                    matches = re.findall(pattern, right_text)
                    for match in matches:
                        try:
                            q_num = int(match[0])
                            ans = match[1]
                            
                            # 숫자 정답을 원형 숫자로 변환
                            if ans.isdigit():
                                idx = int(ans) - 1
                                if 0 <= idx <= 3:
                                    ans = "①②③④"[idx]
                            
                            # 알파벳 정답을 원형 숫자로 변환
                            elif ans in 'ABCD':
                                idx = ord(ans) - ord('A')
                                ans = "①②③④"[idx]
                            
                            answer_dict[q_num] = ans
                        except:
                            pass
            
            return answer_dict
            
        except Exception as e:
            print(f"분할 정답표 추출 중 오류 발생: {e}")
            return {}

def process_pdf_files():
    """PDF 파일을 처리하고 데이터베이스에 저장"""
    db = None
    try:
        # MySQL 연결 정보 - Docker-compose 설정에 맞게 수정
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="1234",  
            database="project",  # docker-compose에서 설정된 데이터베이스명
            port=3307,        # docker-compose에서 설정된 포트
            auth_plugin='mysql_native_password'
        )
        print("MySQL 데이터베이스에 성공적으로 연결되었습니다.")
        
        # 기존 테이블 삭제 및 새 테이블 생성
        drop_tables(db)
        create_tables(db)
        
        # PDF 파일 찾기 - 현재 디렉토리 또는 exam_pdfs 폴더에서 찾음
        pdf_files = []
        if os.path.exists("./exam_pdfs"):
            pdf_files = [os.path.join("./exam_pdfs", f) for f in os.listdir("./exam_pdfs") if f.endswith('.pdf')]
        else:
            pdf_files = [f for f in os.listdir() if f.endswith('.pdf')]
        
        if not pdf_files:
            print("처리할 PDF 파일을 찾을 수 없습니다.")
            return
            
        # PDF 파일 처리
        for pdf_path in pdf_files:
            print(f"\n처리 중인 파일: {os.path.basename(pdf_path)}")
            process_pdf_with_db(pdf_path, db)
                
        # 기존 데이터에 certification_type 연결 업데이트
        update_question_certification_type_links(db)
                
        # 과목별 문제 할당 상태 및 정답 연결 상태 확인
        verify_subject_assignments(db)
        check_answer_quality(db)
                
    except Exception as e:
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        if db:
            try:
                db.close()
                print("MySQL 연결이 종료되었습니다.")
            except:
                pass

def process_pdf_with_db(pdf_path, db):
    try:
        cursor = db.cursor()
        
        # PDF 파일명에서 정보 추출
        filename = os.path.basename(pdf_path)
        cert_name, year, session_text, initial_subject = parse_filename(filename)
        print(f"\n파일 정보: {cert_name}, {year}년, {session_text}, 초기 과목: {initial_subject}")
        
        # 세션 번호 추출 (문자열에서 숫자만 추출)
        session = int(re.sub(r'\D', '', session_text) or 1)
        
        # PDF에서 문제와 선택지 추출
        extractor = PDFExtractor(pdf_path)
        questions = extractor.extract_questions()
        
        print(f"\n추출된 전체 문제 수: {len(questions)}")
        
        # 데이터 검증
        is_valid = validate_parsed_data(questions)
        
        if not is_valid:
            print("\n경고: 추출된 데이터 품질이 낮습니다. 계속 진행하시겠습니까? (y/n)")
            response = input().lower().strip()
            if response != 'y':
                print("작업이 취소되었습니다.")
                return
        
        # 1. Certification 검색 또는 생성 (자격증 중복 방지)
        cursor.execute("""
            SELECT id FROM certification WHERE name = %s
        """, (cert_name,))
        cert_result = cursor.fetchone()
        
        if cert_result:
            cert_id = cert_result[0]
            print(f"기존 자격증 사용: ID {cert_id} ({cert_name})")
        else:
            # 새 자격증 생성
            cursor.execute("""
                INSERT INTO certification (name) 
                VALUES (%s)
            """, (cert_name,))
            cert_id = cursor.lastrowid
            print(f"새 자격증 생성: ID {cert_id} ({cert_name})")
        
        # 2. CertificationType 검색 또는 생성 (시험 유형 중복 방지)
        cursor.execute("""
            SELECT id FROM certification_type 
            WHERE certification_id = %s AND year = %s AND session = %s
        """, (cert_id, year, session))
        cert_type_result = cursor.fetchone()
        
        if cert_type_result:
            cert_type_id = cert_type_result[0]
            print(f"기존 시험 유형 사용: ID {cert_type_id} ({year}년 {session}회)")
        else:
            # 새 시험 유형 생성
            cursor.execute("""
                INSERT INTO certification_type (year, session, certification_id) 
                VALUES (%s, %s, %s)
            """, (year, session, cert_id))
            cert_type_id = cursor.lastrowid
            print(f"새 시험 유형 생성: ID {cert_type_id} ({year}년 {session}회)")
        
        # 3. 정보처리기사 5개 과목 정의
        subjects = [
            {"name": "소프트웨어 설계", "start": 1, "end": 20},
            {"name": "소프트웨어 개발", "start": 21, "end": 40},
            {"name": "데이터베이스 구축", "start": 41, "end": 60},
            {"name": "프로그래밍 언어 활용", "start": 61, "end": 80},
            {"name": "정보시스템 구축관리", "start": 81, "end": 100}
        ]
        
        # 각 과목별 ID 저장
        subject_ids = {}
        
        # 4. 각 과목 검색 또는 생성 및 관계 설정
        for subject in subjects:
            # 과목이 이미 존재하는지 검색
            cursor.execute("""
                SELECT id FROM subject_exam 
                WHERE name = %s AND certification_id = %s
            """, (subject["name"], cert_id))
            subject_result = cursor.fetchone()
            
            if subject_result:
                subject_id = subject_result[0]
                print(f"기존 과목 사용: ID {subject_id} ({subject['name']})")
            else:
                # 새 과목 생성
                cursor.execute("""
                    INSERT INTO subject_exam (name, certification_id) 
                    VALUES (%s, %s)
                """, (subject["name"], cert_id))
                subject_id = cursor.lastrowid
                print(f"새 과목 생성: ID {subject_id} ({subject['name']})")
            
            # 범위 저장
            subject_ids[subject_id] = {
                "name": subject["name"],
                "start": subject["start"],
                "end": subject["end"]
            }
            
            # 과목과 시험 유형 간의 관계가 이미 존재하는지 확인
            cursor.execute("""
                SELECT id FROM certification_subject 
                WHERE certification_type_id = %s AND subject_exam_id = %s
            """, (cert_type_id, subject_id))
            cert_subject_result = cursor.fetchone()
            
            if cert_subject_result:
                cert_subject_id = cert_subject_result[0]
                print(f"기존 자격증-과목 관계 사용: ID {cert_subject_id} ({subject['name']})")
            else:
                # 새 관계 생성
                cursor.execute("""
                    INSERT INTO certification_subject (certification_type_id, subject_exam_id) 
                    VALUES (%s, %s)
                """, (cert_type_id, subject_id))
                cert_subject_id = cursor.lastrowid
                print(f"새 자격증-과목 관계 생성: ID {cert_subject_id} ({subject['name']})")
        
        # 5. 문제 및 답안 삽입 준비
        inserted_questions = 0
        inserted_answers = 0
        question_id_map = {}  # 문제 번호와 DB ID 매핑
        
        # DB에 이미 해당 시험 유형의 문제가 있는지 확인
        cursor.execute("""
            SELECT COUNT(*) FROM questions q
            JOIN subject_exam se ON q.subject_exam_id = se.id
            JOIN certification_subject cs ON se.id = cs.subject_exam_id
            WHERE cs.certification_type_id = %s
        """, (cert_type_id,))
        existing_questions_count = cursor.fetchone()[0]
        
        if existing_questions_count > 0:
            print(f"\n경고: 이 시험 유형({year}년 {session}회)에 이미 {existing_questions_count}개의 문제가 있습니다.")
            print("계속 진행하시겠습니까? 진행하면 새 문제가 추가됩니다. (y/n)")
            response = input().lower().strip()
            if response != 'y':
                print("작업이 취소되었습니다.")
                return
        
        # 6. 문제 저장
        for q in questions:
            try:
                question_num = q.get('question_number')
                
                # 문제 번호에 따라 적절한 과목 ID 찾기
                subject_id_for_question = None
                for subject_id, info in subject_ids.items():
                    if info["start"] <= question_num <= info["end"]:
                        subject_id_for_question = subject_id
                        break
                
                # 적절한 과목을 찾지 못한 경우 경고 출력
                if subject_id_for_question is None:
                    print(f"경고: 문제 {question_num}에 대한 적절한 과목을 찾을 수 없습니다.")
                    # 첫 번째 과목에 할당 (선택적)
                    subject_id_for_question = list(subject_ids.keys())[0]
                
                # 문제 삽입
                cursor.execute("""
                    INSERT INTO questions (content, image_link, subject_exam_id, certification_type_id) 
                    VALUES (%s, %s, %s, %s)
                """, (q.get('text'), q.get('image_link'), subject_id_for_question, cert_type_id))
                question_id = cursor.lastrowid
                question_id_map[question_num] = question_id
                inserted_questions += 1
                
                # 10개 단위로 커밋
                if inserted_questions % 10 == 0:
                    db.commit()
                    print(f"{inserted_questions}개 문제 저장됨...")
            
            except Exception as e:
                print(f"문제 삽입 중 오류: {e}")
                continue
        
        # 커밋
        db.commit()
        print(f"\n총 {inserted_questions}개 문제 저장 완료")
        
        # 7. 정답 저장 (기존 코드 유지)
        for q in questions:
            try:
                question_num = q.get('question_number')
                
                # 정답이 있고 문제 ID가 매핑되어 있는 경우만 처리
                if q.get('answer') and question_num in question_id_map:
                    question_id = question_id_map[question_num]
                    
                    cursor.execute("""
                        INSERT INTO answers (answer_text, explanation, question_id) 
                        VALUES (%s, %s, %s)
                    """, (str(q.get('answer')), "not have explanation", question_id))
                    
                    inserted_answers += 1
                    
                    # 10개 단위로 커밋
                    if inserted_answers % 10 == 0:
                        db.commit()
                        print(f"{inserted_answers}개 답안 저장됨...")
            
            except Exception as e:
                print(f"답안 삽입 중 오류: {e}")
                continue
        
        # 최종 커밋
        db.commit()
        print(f"\n총 {inserted_questions}개의 문제와 {inserted_answers}개의 답안이 저장되었습니다.")
        
        # 8. 과목별 저장된 문제 수 출력
        cursor.execute("""
            SELECT se.name, COUNT(q.id) as question_count
            FROM subject_exam se
            JOIN certification_subject cs ON se.id = cs.subject_exam_id
            LEFT JOIN questions q ON se.id = q.subject_exam_id
            WHERE cs.certification_type_id = %s
            GROUP BY se.name
            ORDER BY se.id
        """, (cert_type_id,))
        
        subject_counts = cursor.fetchall()
        print(f"\n=== {cert_name} {year}년 {session}회 과목별 문제 수 ===")
        for name, count in subject_counts:
            print(f"{name}: {count}문제")
        
        # 정답 연결 비율 확인
        answer_ratio = inserted_answers / inserted_questions if inserted_questions > 0 else 0
        print(f"\n정답 연결 비율: {answer_ratio:.2%}")
        
        if answer_ratio < 0.9:
            print("경고: 정답 연결 비율이 90% 미만입니다. 정답 추출 로직을 확인하세요.")
        
        # 9. 전체 통계 출력
        cursor.execute("""
            SELECT c.name, COUNT(DISTINCT ct.id) as type_count, COUNT(DISTINCT se.id) as subject_count, COUNT(q.id) as question_count
            FROM certification c
            LEFT JOIN certification_type ct ON c.id = ct.certification_id
            LEFT JOIN certification_subject cs ON ct.id = cs.certification_type_id
            LEFT JOIN subject_exam se ON cs.subject_exam_id = se.id
            LEFT JOIN questions q ON se.id = q.subject_exam_id
            GROUP BY c.name
        """)
        
        stats = cursor.fetchall()
        print("\n=== 전체 데이터베이스 통계 ===")
        for name, type_count, subject_count, question_count in stats:
            print(f"{name}: {type_count}개 시험유형, {subject_count}개 과목, {question_count}개 문제")
        
    except Exception as e:
        try:
            db.rollback()
        except:
            pass
        print(f"PDF 처리 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'cursor' in locals():
            cursor.close()

def validate_parsed_data(questions):
    """추출된 문제와 답안의 품질 검증"""
    if not questions:
        print("오류: 추출된 문제가 없습니다.")
        return False
        
    valid_count = 0
    warnings = []
    
    for idx, q in enumerate(questions):
        # 문제 번호 확인
        if not q.get('question_number'):
            warnings.append(f"문제 {idx+1}: 문제 번호 누락")
            continue
            
        # 문제 내용 확인
        if not q.get('text') or len(q.get('text', '')) < 20:
            warnings.append(f"문제 {q.get('question_number')}: 문제 내용이 너무 짧음")
            continue
            
        # 선택지 확인 (간단히 ①②③④ 문자 포함 여부로)
        has_choices = any(choice in q.get('text', '') for choice in '①②③④')
        if not has_choices:
            warnings.append(f"문제 {q.get('question_number')}: 선택지 누락 의심")
            
        # 답안 확인
        if not q.get('answer'):
            warnings.append(f"문제 {q.get('question_number')}: 답안 누락")
        
        valid_count += 1
    
    # 경고 메시지 출력
    if warnings:
        print("\n데이터 검증 경고:")
        for warning in warnings[:10]:  # 처음 10개만 표시
            print(f"- {warning}")
            
        if len(warnings) > 10:
            print(f"... 외 {len(warnings)-10}개 경고")
    
    print(f"\n검증 결과: 전체 {len(questions)}개 중 {valid_count}개 유효")
    
    # 최소 기준 (50% 이상 유효)
    return valid_count >= len(questions) * 0.5 if questions else False

def verify_subject_assignments(db):
    """과목별 할당된 문제 수 확인"""
    cursor = db.cursor()
    
    # 과목별 문제 수 확인
    cursor.execute("""
    SELECT s.id, s.name, c.name, ct.year, ct.session, COUNT(q.id) as question_count
    FROM subject_exam s
    JOIN certification c ON s.certification_id = c.id
    JOIN certification_subject cs ON s.id = cs.subject_exam_id
    JOIN certification_type ct ON cs.certification_type_id = ct.id
    LEFT JOIN questions q ON q.subject_exam_id = s.id
    GROUP BY s.id, s.name, c.name, ct.year, ct.session
    """)
    
    results = cursor.fetchall()
    print("\n=== 과목별 문제 할당 현황 ===")
    for row in results:
        print(f"과목 ID: {row[0]}, 과목명: {row[1]}")
        print(f"시험: {row[2]} {row[3]}년 {row[4]}회")
        print(f"할당된 문제 수: {row[5]}")
        print("-" * 40)
    
    cursor.close()

def check_answer_quality(db):
    """정답 연결 품질 확인"""
    cursor = db.cursor()
    cursor.execute("""
    SELECT q.id, q.content, a.answer_text
    FROM questions q
    LEFT JOIN answers a ON q.id = a.question_id
    LIMIT 20
    """)
    results = cursor.fetchall()
    
    print("\n=== 문제-정답 연결 확인 (처음 20개) ===")
    for row in results:
        question_id = row[0]
        content_sample = row[1][:50].replace('\n', ' ') + "..."
        answer = row[2] if row[2] else "정답 없음"
        
        print(f"문제 ID: {question_id}")
        print(f"내용: {content_sample}")
        print(f"정답: {answer}")
        print("-" * 40)
    
    # 정답 통계
    cursor.execute("""
    SELECT COUNT(*) AS total_questions, 
           SUM(CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END) AS answered
    FROM questions q
    LEFT JOIN answers a ON q.id = a.question_id
    """)
    stats = cursor.fetchone()
    
    if stats:
        total = stats[0]
        answered = stats[1]
        print(f"\n총 {total}개 문제 중 {answered}개 정답 연결됨 ({answered/total*100:.1f}%)")
    
    cursor.close()

def update_question_certification_type_links(db):
    """기존 DB에 있는 Question 데이터에 certification_type_id 연결 추가"""
    try:
        cursor = db.cursor()
        
        # certification_type_id 컬럼이 있는지 확인
        cursor.execute("""
            SELECT COUNT(*) FROM information_schema.columns 
            WHERE table_name = 'questions' AND column_name = 'certification_type_id'
        """)
        column_exists = cursor.fetchone()[0] > 0
        
        if not column_exists:
            print("questions 테이블에 certification_type_id 컬럼 추가 중...")
            cursor.execute("""
                ALTER TABLE questions 
                ADD COLUMN certification_type_id BIGINT
            """)
            cursor.execute("""
                ALTER TABLE questions 
                ADD CONSTRAINT fk_question_certification_type 
                FOREIGN KEY (certification_type_id) REFERENCES certification_type(id)
            """)
            print("컬럼 및 외래 키 제약 조건 추가 완료")
        
        # 업데이트가 필요한 질문 수 확인
        cursor.execute("""
            SELECT COUNT(*) FROM questions 
            WHERE certification_type_id IS NULL
        """)
        null_count = cursor.fetchone()[0]
        
        if null_count == 0:
            print("모든 문제에 certification_type_id가 이미 설정되어 있습니다.")
            return
        
        print(f"{null_count}개의 문제에 certification_type_id 설정이 필요합니다.")
        
        # subject_exam을 통해 certification_type_id를 찾아 설정
        cursor.execute("""
            UPDATE questions q
            JOIN subject_exam se ON q.subject_exam_id = se.id
            JOIN certification_subject cs ON se.id = cs.subject_exam_id
            SET q.certification_type_id = cs.certification_type_id
            WHERE q.certification_type_id IS NULL
        """)
        
        # 영향 받은 행 수 확인
        updated = cursor.rowcount
        db.commit()
        print(f"{updated}개 문제의 certification_type_id 설정 완료")
        
        # 여전히 NULL인 항목이 있는지 확인
        cursor.execute("""
            SELECT COUNT(*) FROM questions 
            WHERE certification_type_id IS NULL
        """)
        remaining_null = cursor.fetchone()[0]
        
        if remaining_null > 0:
            print(f"주의: {remaining_null}개 문제는 여전히 certification_type_id가 NULL입니다.")
            print("이 문제들에 대해 명시적으로 certification_type_id를 설정해야 합니다.")
        
    except Exception as e:
        print(f"데이터 마이그레이션 중 오류 발생: {e}")
        db.rollback()
    finally:
        cursor.close()

if __name__ == "__main__":
    process_pdf_files()
