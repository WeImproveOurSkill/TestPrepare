import os
import re
import sqlite3
import mysql.connector
import pypdf
import pdfplumber
from dataclasses import dataclass, field
from typing import List, Optional, Dict
import io
from PIL import Image
import uuid  # UUID 모듈 추가
import requests
from bs4 import BeautifulSoup
from zipfile import ZipFile
import shutil
from tqdm import tqdm
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

@dataclass
class Answer:
    id: Optional[int] = None
    answerText: str = ""  # answer_text -> answerText
    explanation: str = "not have explanation"
    question: Optional['Question'] = None

    def __str__(self) -> str:
        return f"""
        [답안 정보]
        - 답안: {self.answerText}
        - 해설: {self.explanation}
        """

@dataclass
class Question:
    id: Optional[int] = None
    content: str = ""
    imageLink: Optional[str] = None  # image_link -> imageLink
    subjectExam: Optional['SubjectExam'] = None  # subject_exam -> subjectExam
    certificationType: Optional['CertificationType'] = None  # certification_type -> certificationType
    answer: Optional[Answer] = None

    def __str__(self) -> str:
        return f"""
        [문제 정보]
        - 내용: {self.content[:100]}...
        - 이미지: {self.imageLink if self.imageLink else '없음'}
        - 회차: {f"{self.certificationType.year}년 {self.certificationType.session}회" if self.certificationType else '미지정'}
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
    certificationSubjects: List['CertificationSubject'] = None  # certification_subjects -> certificationSubjects

    def __post_init__(self):
        if self.questions is None:
            self.questions = []
        if self.certificationSubjects is None:
            self.certificationSubjects = []

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
    subjects: List[SubjectExam] = None  # subject_exams -> subjects
    certificationTypes: List['CertificationType'] = None  # certification_types -> certificationTypes

    def __post_init__(self):
        if self.subjects is None:
            self.subjects = []
        if self.certificationTypes is None:
            self.certificationTypes = []

    def __str__(self) -> str:
        return f"""
        [자격증 정보]
        - 자격증명: {self.name}
        - 유형 수: {len(self.certificationTypes)}
        - 과목 수: {len(self.subjects)}
        """

@dataclass
class CertificationType:
    id: Optional[int] = None
    year: int = 0
    session: int = 0
    certification: Optional[Certification] = None
    certificationSubjects: List['CertificationSubject'] = None  # certification_subjects -> certificationSubjects
    questions: List[Question] = None

    def __post_init__(self):
        if self.certificationSubjects is None:
            self.certificationSubjects = []
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
    certificationType: Optional[CertificationType] = None  # certification_type -> certificationType
    subjectExam: Optional[SubjectExam] = None  # subject_exam -> subjectExam

    def __str__(self) -> str:
        return f"""
        [자격증-과목 관계]
        - 자격증 유형: {self.certificationType.certification.name if self.certificationType and self.certificationType.certification else '미지정'} {self.certificationType.year}년 {self.certificationType.session}회
        - 과목: {self.subjectExam.name if self.subjectExam else '미지정'}
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

def create_tables(conn):
    """테이블 생성"""
    cursor = conn.cursor()
    
    # 외래 키 제약조건 일시 비활성화
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
    
    # 1. certification 테이블 생성
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS certification (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        )
    """)
    
    # 2. subject_exam 테이블 생성
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subject_exam (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            certification_id BIGINT NOT NULL,
            FOREIGN KEY (certification_id) REFERENCES certification(id),
            UNIQUE KEY unique_subject (name, certification_id)
        )
    """)
    
    # 3. certification_type 테이블 생성
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS certification_type (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            certification_id BIGINT NOT NULL,
            year INT NOT NULL,
            session INT NOT NULL,
            FOREIGN KEY (certification_id) REFERENCES certification(id),
            UNIQUE KEY unique_cert_type (certification_id, year, session)
        )
    """)
    
    # 4. certification_subject 테이블 생성
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS certification_subject (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            certification_type_id BIGINT NOT NULL,
            subject_exam_id BIGINT NOT NULL,
            FOREIGN KEY (certification_type_id) REFERENCES certification_type(id),
            FOREIGN KEY (subject_exam_id) REFERENCES subject_exam(id),
            UNIQUE KEY unique_cert_subject (certification_type_id, subject_exam_id)
        )
    """)
    
    # 5. questions 테이블 생성
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            content TEXT NOT NULL,
            subject_exam_id BIGINT NOT NULL,
            certification_type_id BIGINT NOT NULL,
            FOREIGN KEY (subject_exam_id) REFERENCES subject_exam(id),
            FOREIGN KEY (certification_type_id) REFERENCES certification_type(id)
        )
    """)
    
    # 6. answers 테이블 생성
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS answers (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            answer_text TEXT NOT NULL,
            explanation TEXT,
            question_id BIGINT NOT NULL,
            FOREIGN KEY (question_id) REFERENCES questions(id)
        )
    """)
    
    # 외래 키 제약조건 다시 활성화
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
    
    conn.commit()
    cursor.close()
    print("테이블 생성 완료")

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
            if question and self._is_objective_question(question.get('content', '')):
                # 선택지 추출 및 정리
                content = question.get('content', '')
                choices = self._extract_choices(content)
                
                # 문제 내용과 선택지를 하나의 문자열로 결합
                if choices:
                    # 문제 내용에서 선택지 부분 제거
                    question_content = re.sub(r'[①②③④⑤].*$', '', content, flags=re.DOTALL).strip()
                    # 선택지 추가
                    formatted_choices = '\n'.join(choices)
                    question['content'] = f"{question_content}\n{formatted_choices}"
                
                questions.append(question)
        
        return questions
    
    def _extract_choices(self, content):
        """문제 내용에서 선택지 추출"""
        choices = []
        
        # 원형 숫자 선택지 패턴 (①②③④⑤)
        circle_pattern = r'([①②③④⑤])\s*(.*?)(?=[①②③④⑤]|$)'
        circle_matches = re.finditer(circle_pattern, content, re.DOTALL)
        
        for match in circle_matches:
            choice_num = match.group(1)
            choice_text = match.group(2).strip()
            if choice_text:
                choices.append(f"{choice_num} {choice_text}")
        
        # 원형 숫자가 없는 경우 다른 형식의 선택지 시도
        if not choices:
            # 괄호 숫자 선택지 패턴 (1) 2) 3) 4) 5)
            bracket_pattern = r'(\d+)\)\s*(.*?)(?=\d+\)|$)'
            bracket_matches = re.finditer(bracket_pattern, content, re.DOTALL)
            
            for match in bracket_matches:
                choice_num = int(match.group(1))
                choice_text = match.group(2).strip()
                if choice_text and 1 <= choice_num <= 5:
                    circle_num = "①②③④⑤"[choice_num-1]
                    choices.append(f"{circle_num} {choice_text}")
        
        return choices
    
    def _split_into_question_blocks(self, text):
        """텍스트를 문제 단위로 분리"""
        # 문제 번호로 시작하는 패턴으로 분리
        blocks = re.split(r'(?=\n?\d+\.)', text)
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
        
        # 알파벳 선택지 처리
        text = re.sub(r'([A-E][\.\)])', r'\n\1', text)
        
        # 문제 내용이 "번호." 다음 내용이 잘 분리되도록
        text = re.sub(r'(\d+\.\s*)([^\n])', r'\1 \2', text)
        
        # Coad와 Yourdon 같은 특수 케이스 처리
        text = re.sub(r'([A-Za-z]+)[와과]\s+([A-Za-z]+)\s+방법', r'\1와 \2 방법', text)
        
        # 괄호 안의 숫자 선택지 처리
        text = re.sub(r'\(\s*(\d)\s*\)', r'(\1)', text)
        
        return text
    
    def _is_objective_question(self, content: str) -> bool:
        """객관식 문제인지 확인"""
        # 객관식 문제 패턴
        objective_patterns = [
            r'①.*?②.*?③.*?④.*?⑤',  # 원형 숫자 선택지
            r'\(1\).*?\(2\).*?\(3\).*?\(4\).*?\(5\)',  # 괄호 숫자 선택지
            r'1\).*?2\).*?3\).*?4\).*?5\)',  # 괄호 없는 숫자 선택지
            r'[A-E][\.\)].*?[A-E][\.\)].*?[A-E][\.\)].*?[A-E][\.\)]'  # 알파벳 선택지
        ]
        
        # 주관식 문제 패턴
        subjective_patterns = [
            r'답\s*:\s*[가-힣]',  # 한글 답
            r'답\s*:\s*[A-Za-z]',  # 영문 답
            r'답\s*:\s*\d+',  # 숫자 답
            r'답\s*:\s*[가-힣A-Za-z0-9]+',  # 복합 답
            r'서술하시오',
            r'설명하시오',
            r'작성하시오',
            r'기술하시오',
            r'제시하시오',
            r'나열하시오',
            r'분석하시오',
            r'비교하시오',
            r'평가하시오',
            r'제안하시오',
            r'계산하시오',
            r'도출하시오',
            r'유도하시오',
            r'증명하시오',
            r'해결하시오',
            r'구현하시오'
        ]
        
        # 주관식 패턴이 있으면 제외
        for pattern in subjective_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                return False
        
        # 객관식 패턴이 있으면 포함
        for pattern in objective_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                return True
        
        return False
    
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

def split_text_by_questions(text, questions_per_batch=20):
    # 문제 번호 패턴으로 분할 (예: 1. ~ 20. 까지)
    question_blocks = re.split(r'(?=\n?\d+\.)', text)
    batches = []
    for i in range(0, len(question_blocks), questions_per_batch):
        batch = ''.join(question_blocks[i:i+questions_per_batch])
        batches.append(batch)
    return batches

def merge_json_batches(json_batches):
    # Perplexity 응답 JSON들을 하나의 certification 구조로 합침
    merged = None
    question_id = 1
    answer_id = 1
    for batch in json_batches:
        cert = batch.get('certification')
        if not cert:
            continue
        if merged is None:
            merged = cert
            # 첫 번째 배치의 questions/answers id를 1부터 재정렬
            for subj in merged.get('subjectExams', []):
                for q in subj.get('questions', []):
                    q['id'] = question_id
                    q['answer']['id'] = answer_id
                    question_id += 1
                    answer_id += 1
        else:
            # subjectExams 병합
            for subj in cert.get('subjectExams', []):
                # 같은 과목명 찾기
                found = False
                for msubj in merged.get('subjectExams', []):
                    if msubj['name'] == subj['name']:
                        # 문제 추가, id 재정렬
                        for q in subj.get('questions', []):
                            q['id'] = question_id
                            q['answer']['id'] = answer_id
                            msubj['questions'].append(q)
                            question_id += 1
                            answer_id += 1
                        found = True
                        break
                if not found:
                    # 새로운 과목이면 추가
                    for q in subj.get('questions', []):
                        q['id'] = question_id
                        q['answer']['id'] = answer_id
                        question_id += 1
                        answer_id += 1
                    merged['subjectExams'].append(subj)
    return {"certification": merged} if merged else {}

def process_pdfs(pdf_dir, api_key, db, cert_name):
    from temp import PDFProcessor, PerplexityAPI, CertificationManager
    import json as pyjson
    cert_manager = CertificationManager()
    print("[3] PDF 파싱 및 DB 저장 시작...")
    
    # 자격증 정보 로드
    certification = None
    for cert in cert_manager.certifications:
        if cert.name == cert_name:
            certification = cert
            break
    
    if not certification:
        print(f"오류: {cert_name} 자격증 정보를 찾을 수 없습니다.")
        return
    
    # 디버깅 로깅 추가: certification 객체 및 subjects 속성 확인
    print(f"\n--- [DEBUG] Certification 객체 확인 ---")
    print(f"Type: {type(certification)}")
    print(f"Content: {certification}")
    if hasattr(certification, 'subjects'):
        print(f"Subjects Type: {type(certification.subjects)}")
        if isinstance(certification.subjects, list):
            print(f"Subjects count: {len(certification.subjects)}")
            if certification.subjects:
                print(f"Subjects sample (first 3): {[s.name for s in certification.subjects[:3]]}")
        else:
            print(f"Subjects is not a list.")
    else:
        print(f"Certification object has no 'subjects' attribute.")
    print(f"---")
    
    print(f"자격증 정보 로드 완료: {certification.name}")
    print(f"과목 목록: {[subject.name for subject in certification.subjects]}")
    
    for fname in os.listdir(pdf_dir):
        if fname.endswith(".pdf"):
            pdf_path = os.path.join(pdf_dir, fname)
            print(f"  - 파싱 시작: {fname} (자격증명: {cert_name})")
            
            # PDF 처리
            processor = PDFProcessor(pdf_path, cert_manager, cert_name=cert_name)
            text = processor.extract_text()
            print(f"    > 텍스트 추출 완료")
            
            # Perplexity API 호출
            api = PerplexityAPI(api_key)
            batches = split_text_by_questions(text, questions_per_batch=100)
            batch_results = []
            
            for idx, batch_text in enumerate(batches):
                print(f"    > Perplexity API {idx+1}/{len(batches)}번째 배치 호출 중...")
                result = api.process_exam_text(
                    batch_text, 
                    processor.exam_info, 
                    force_cert_name=cert_name,
                    subjects=[subject.name for subject in certification.subjects]
                )
                print(f"    > [DEBUG] batch {idx+1} 응답 JSON:")
                print(pyjson.dumps(result, ensure_ascii=False, indent=2))
                batch_results.append(result)
            
            print(f"    > 모든 배치 응답 수신, JSON 병합 중...")
            merged_json = merge_json_batches(batch_results)
            
            # API 응답 JSON 상세 로깅 추가
            print(f"\n--- [DEBUG] 병합된 API 응답 JSON (save_json_to_db 호출 직전) ---")
            try:
                print(pyjson.dumps(merged_json, ensure_ascii=False, indent=2))
            except Exception as json_e:
                print(f"JSON 로깅 오류: {json_e}")
                print(f"Raw merged_json type: {type(merged_json)}")
                print(f"Raw merged_json content sample: {str(merged_json)[:500]}...")
            print(f"---")
            
            # 과목 필터링
            if merged_json and 'certification' in merged_json:
                filtered_subjects = []
                for subject in merged_json['certification'].get('subjectExams', []):
                    # 자격증의 과목 목록에 있는 과목만 포함
                    if any(s.name == subject['name'] for s in certification.subjects):
                        filtered_subjects.append(subject)
                merged_json['certification']['subjectExams'] = filtered_subjects
            
            print(f"    > [DEBUG] 병합된 전체 JSON:")
            print(pyjson.dumps(merged_json, ensure_ascii=False, indent=2))
            print(f"    > 병합된 JSON을 DB에 저장 중...")
            save_json_to_db(merged_json, db)
            print(f"    > DB 저장 완료, PDF 파일 삭제: {fname}")
            os.remove(pdf_path)
    
    print("[3] PDF 파싱 및 DB 저장 전체 완료.")

def save_json_to_db(json_data: Dict, conn) -> None:
    """JSON 데이터를 DB에 저장"""
    if not json_data or not isinstance(json_data, dict):
        print("  - [DB 저장] 유효하지 않은 JSON 데이터")
        return
        
    if 'certification' not in json_data:
        print("  - [DB 저장] certification 키가 없습니다")
        return
        
    cursor = None
    try:
        cursor = conn.cursor()
        
        # 1. 자격증 저장
        cert_name = json_data['certification']['name']
        print(f"  - [DB 저장] 자격증 저장 시도: {cert_name}")
        
        cursor.execute("""
            INSERT INTO certification (name) 
            VALUES (%s)
            ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
        """, (cert_name,))
        
        cursor.execute("SELECT id FROM certification WHERE name = %s", (cert_name,))
        cert_row = cursor.fetchone()
        if not cert_row:
            raise Exception(f"자격증 저장 실패: {cert_name}")
        certification_id = cert_row[0]
        print(f"  - [DB 저장] 자격증 저장/조회 완료: {cert_name} (ID: {certification_id})")
        
        # 2. 자격증 유형 저장
        for cert_type in json_data['certification'].get('certificationTypes', []):
            year = cert_type.get('year')
            session = cert_type.get('session')
            
            if not year or not session:
                print(f"  - [DB 저장] 자격증 유형 정보 누락 (year: {year}, session: {session})")
                continue
                
            print(f"  - [DB 저장] 자격증 유형 저장 시도: {year}년 {session}회")
            
            cursor.execute("""
                INSERT INTO certification_type (certification_id, year, session) 
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
            """, (certification_id, year, session))
            
            cursor.execute("""
                SELECT id FROM certification_type 
                WHERE certification_id = %s AND year = %s AND session = %s
            """, (certification_id, year, session))
            
            cert_type_row = cursor.fetchone()
            if not cert_type_row:
                raise Exception(f"자격증 유형 저장 실패: {year}년 {session}회")
            cert_type_id = cert_type_row[0]
            print(f"  - [DB 저장] 자격증 유형 저장/조회 완료: {year}년 {session}회 (ID: {cert_type_id})")
            
            # 3. 과목 저장 및 문제 저장
            for question in cert_type.get('questions', []):
                if not isinstance(question, dict):
                    print(f"  - [DB 저장] 유효하지 않은 문제 데이터 형식")
                    continue
                    
                subject_name = question.get('subject')
                if not subject_name:
                    print(f"  - [DB 저장] 과목명 누락")
                    continue
                    
                print(f"    - [DB 저장] 과목 저장 시도: {subject_name}")
                
                # 과목 저장
                cursor.execute("""
                    INSERT INTO subject_exam (name, certification_id) 
                    VALUES (%s, %s)
                    ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
                """, (subject_name, certification_id))
                
                cursor.execute("""
                    SELECT id FROM subject_exam 
                    WHERE name = %s AND certification_id = %s
                """, (subject_name, certification_id))
                
                subject_row = cursor.fetchone()
                if not subject_row:
                    print(f"    - [DB 저장] 과목 저장 실패: {subject_name}")
                    continue
                    
                subject_id = subject_row[0]
                print(f"    - [DB 저장] 과목 저장/조회 완료: {subject_name} (ID: {subject_id})")
                
                # 자격증-과목 관계 저장
                print(f"      - [DB 저장] 자격증-과목 관계 저장 시도: cert_type_id={cert_type_id}, subject_id={subject_id}")
                cursor.execute("""
                    INSERT INTO certification_subject (certification_type_id, subject_exam_id)
                    VALUES (%s, %s)
                    ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
                """, (cert_type_id, subject_id))
                print(f"      - [DB 저장] 자격증-과목 관계 저장 완료")
                
                # 문제 저장
                content = question.get('content')
                if not content:
                    print(f"      - [DB 저장] 문제 내용 누락")
                    continue
                    
                content_sample = content[:50].replace('\n', ' ') + '...'
                print(f"        - [DB 저장] 문제 저장 시도: 내용 샘플='{content_sample}'")
                
                cursor.execute("""
                    INSERT INTO questions (content, subject_exam_id, certification_type_id)
                    VALUES (%s, %s, %s)
                """, (content, subject_id, cert_type_id))
                
                question_id = cursor.lastrowid
                if not question_id:
                    print(f"        - [DB 저장] 문제 저장 실패")
                    continue
                    
                print(f"        - [DB 저장] 문제 저장 완료: ID={question_id}")
                
                # 답안 저장
                answer = question.get('answer')
                if not answer or not isinstance(answer, dict):
                    print(f"          - [DB 저장] 답안 데이터 누락 또는 형식 오류")
                    continue
                    
                answer_text = answer.get('answerText', '')
                explanation = answer.get('explanation', '')
                
                if answer_text:
                    print(f"          - [DB 저장] 답안 저장 시도: 답='{answer_text}'")
                    cursor.execute("""
                        INSERT INTO answers (answer_text, explanation, question_id)
                        VALUES (%s, %s, %s)
                    """, (answer_text, explanation, question_id))
                    print(f"          - [DB 저장] 답안 저장 완료: question_id={question_id}")
                else:
                    print(f"          - [DB 저장] 답안 데이터(answer_text) 누락 또는 비어있음: question_id={question_id}")
        
        # 트랜잭션 커밋
        conn.commit()
        print(f"  - [DB 저장] 데이터 저장 트랜잭션 커밋 완료: {cert_name}")
        
    except Exception as e:
        if cursor:
            conn.rollback()
        print(f"  - [DB 저장] 데이터 저장 중 오류 발생: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        if cursor:
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

def download_zip_files(base_url, download_dir, cert_keywords):
    os.makedirs(download_dir, exist_ok=True)
    page = 1
    zip_links = []
    print("[1] ZIP 파일 다운로드 시작...")
    while True:
        url = f"{base_url}?page={page}"
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, "html.parser")
        links = soup.find_all("a", href=True, string=lambda t: t and any(k in t for k in cert_keywords) and t.endswith(".zip"))
        if not links:
            break
        for link in links:
            zip_url = link['href']
            link_text = link.get_text(strip=True)
            # 자격증명 추출 (예: "2023 정보처리기사 필기 기출문제")
            cert_name_match = re.search(r'(정보처리기사|가스기사|전기기사|리눅스마스터|네트워크관리사)', link_text)
            cert_name = cert_name_match.group(1) if cert_name_match else "알 수 없음"
            if not zip_url.startswith("http"):
                zip_url = "https://www.sinagong.co.kr" + zip_url
            zip_links.append({'url': zip_url, 'cert_name': cert_name})
        page += 1

    for item in tqdm(zip_links, desc="ZIP 파일 다운로드"):
        zip_url = item['url']
        cert_name = item['cert_name']
        basename = os.path.basename(zip_url)
        if not basename.endswith('.zip'):
            basename += '.zip'
        filename = os.path.join(download_dir, basename)
        print(f"  - 다운로드: {zip_url} -> {filename} (자격증명: {cert_name})")
        with requests.get(zip_url, stream=True) as r:
            with open(filename, "wb") as f:
                shutil.copyfileobj(r.raw, f)
    print(f"[1] ZIP 파일 다운로드 완료: 총 {len(zip_links)}개 파일")
    return zip_links

def extract_and_move_pdfs(zip_dir, pdf_dir):
    os.makedirs(pdf_dir, exist_ok=True)
    print("[2] 압축 해제 및 PDF 이동 시작...")
    for fname in os.listdir(zip_dir):
        if fname.endswith(".zip"):
            print(f"  - 압축 해제: {fname}")
            with ZipFile(os.path.join(zip_dir, fname), 'r') as zip_ref:
                zip_ref.extractall(zip_dir)
            os.remove(os.path.join(zip_dir, fname))
    for fname in os.listdir(zip_dir):
        if fname.endswith(".pdf"):
            print(f"  - PDF 이동: {fname} -> {pdf_dir}")
            shutil.move(os.path.join(zip_dir, fname), os.path.join(pdf_dir, fname))
    print("[2] 압축 해제 및 PDF 이동 완료.")

if __name__ == "__main__":
    # 자격증 이름을 사용자로부터 입력받음
    cert_name = input("진행할 자격증 이름을 입력하세요 (예: 정보처리기사): ").strip()
    # 기본 경로 설정 (모두 Data/ 하위)
    # base_url = "https://www.sinagong.co.kr/pds/001002001/past-exams" #정보처리산업기사
    base_url = "https://www.sinagong.co.kr/pds/001001001/past-exams" # 정보처리기사
    zip_dir = "Data/temp_zips"         # zip 파일 임시 저장
    pdf_dir = "Data/exam_pdfs"         # PDF 저장
    api_key = "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"  # 실제 키로 교체 필요

    # MySQL DB 연결 객체 생성 (pdf_extractor.py와 동일하게)
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",         # 실제 비밀번호로 변경
        database="project",      # 실제 데이터베이스명으로 변경
        port=3307,                # docker-compose에서 지정한 포트
        auth_plugin='mysql_native_password'
    )

    # 자격증별 키워드 목록 (확장 가능)
    cert_keywords = [cert_name]

    # DB 테이블 초기화 및 생성 (개발/디버깅 시에만 사용)
    print("\n[0] DB 테이블 초기화 및 생성 시작...")
    drop_tables(db) # 기존 테이블 삭제
    create_tables(db) # 새 테이블 생성
    print("[0] DB 테이블 초기화 및 생성 완료.")
    
    # 1. zip 파일 다운로드
    download_zip_files(base_url, zip_dir, cert_keywords)
    # 2. 압축 해제 및 PDF 이동
    extract_and_move_pdfs(zip_dir, pdf_dir)
    # 3. PDF 파싱, API 호출, DB 저장, 파일 삭제 (입력받은 cert_name을 강제 사용)
    process_pdfs(pdf_dir, api_key, db, cert_name)

    # 모든 작업이 끝나면 DB 연결 종료
    db.close()
