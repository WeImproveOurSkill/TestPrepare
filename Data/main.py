import os
import re
from dataclasses import dataclass
from typing import Optional, List
import mysql.connector

from utils.pdf_extractor import ExamPDFExtractor


@dataclass
class Answer:
    id: Optional[int] = None
    answer_text: str = ""
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
    image_link: Optional[str] = None
    subject_exam: Optional['SubjectExam'] = None
    answer: Optional[Answer] = None

    def __str__(self) -> str:
        return f"""
        [문제 정보]
        - 내용: {self.content[:100]}...
        - 이미지: {self.image_link if self.image_link else '없음'}
        {self.answer if self.answer else '- 답안 정보 없음'}
        """

    def get_choices(self) -> Optional[str]:
        if self.content:
            return self.content.replace(".*?(?=1\\)|$)", "")
        return None

    def get_question_content(self) -> Optional[str]:
        if self.content:
            return self.content.replace("(?:1\\)|2\\)|3\\)|4\\)|5\\)).*", "").strip()
        return None

@dataclass
class SubjectExam:
    id: Optional[int] = None
    name: str = ""
    certification: Optional['Certification'] = None
    questions: List[Question] = None

    def __post_init__(self):
        if self.questions is None:
            self.questions = []

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
    year: int = 0
    session: str = ""
    subject_exams: List[SubjectExam] = None

    def __post_init__(self):
        if self.subject_exams is None:
            self.subject_exams = []

    def __str__(self) -> str:
        return f"""
        [자격증 시험 정보]
        - 자격증명: {self.name}
        - 년도: {self.year}
        - 회차: {self.session}
        - 과목 수: {len(self.subject_exams)}
        """

def drop_tables(db):
    cursor = db.cursor()
    
    # 테이블 삭제 쿼리들 (외래 키 제약조건 때문에 순서 중요)
    drop_queries = [
        "DROP TABLE IF EXISTS answers",
        "DROP TABLE IF EXISTS questions",
        "DROP TABLE IF EXISTS subject_exam",
        "DROP TABLE IF EXISTS certification"
    ]
    
    # 각 쿼리 실행
    for query in drop_queries:
        try:
            cursor.execute(query)
            print(f"테이블 삭제 완료: {query}")
        except Exception as e:
            print(f"테이블 삭제 중 오류 발생: {e}")
            raise e
    
    db.commit()
    cursor.close()
    print("모든 테이블이 성공적으로 삭제되었습니다.")

def create_tables(db):
    cursor = db.cursor()
    
    # 테이블 생성 쿼리들
    queries = [
        """
        CREATE TABLE IF NOT EXISTS certification (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            year INT NOT NULL,
            session VARCHAR(255) NOT NULL,
            UNIQUE KEY unique_cert (name, year, session)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS subject_exam (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            certification_id BIGINT NOT NULL,
            FOREIGN KEY (certification_id) REFERENCES certification(id),
            UNIQUE KEY unique_subject (name, certification_id)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS questions (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            content TEXT NOT NULL,
            image_link VARCHAR(255),
            subject_exam_id BIGINT NOT NULL,
            FOREIGN KEY (subject_exam_id) REFERENCES subject_exam(id)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS answers (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            answer_text TEXT NOT NULL,
            explanation TEXT,
            question_id BIGINT NOT NULL UNIQUE,
            FOREIGN KEY (question_id) REFERENCES questions(id)
        )
        """
    ]
    
    # 각 쿼리 실행
    for query in queries:
        try:
            cursor.execute(query)
        except Exception as e:
            print(f"테이블 생성 중 오류 발생: {e}")
            raise e
    
    db.commit()
    cursor.close()

def parse_filename(filename: str) -> tuple[str, int, str, Optional[str]]:
    """파일명에서 자격증 정보와 과목명을 추출"""
    # 파일 확장자 제거
    filename = filename.replace('.pdf', '')
    parts = filename.split('_')
    
    # 기본 형식 검증 (최소 3개 부분: 자격증명_연도_회차)
    if len(parts) < 3:
        raise ValueError(f"잘못된 파일명 형식: {filename}\n파일명은 '자격증명_연도_회차.pdf' 또는 '자격증명_연도_회차_과목명.pdf' 형식이어야 합니다.")
    
    cert_name = parts[0]
    
    # 연도 변환 검증
    try:
        year = int(parts[1])
    except ValueError:
        raise ValueError(f"잘못된 연도 형식: {parts[1]}")
    
    session = parts[2]
    
    # 과목명이 있는 경우 사용, 없으면 None 반환
    subject_name = parts[3] if len(parts) > 3 else None
    
    return cert_name, year, session, subject_name

def detect_subject_change(content: str) -> Optional[str]:
    """문제 내용에서 과목 변경 여부를 감지하고 새로운 과목명을 반환"""
    # 과목 변경을 나타내는 패턴들
    patterns = [
        r'제\d+과목\s+([^\n]+)',  # 제1과목 소프트웨어 설계
        r'(?:다음은|이하는)\s*「([^」]+)」\s*(?:과목|영역|분야)',  # 「과목명」 과목
        r'※\s*([^\n]+)\s*과목',  # ※ 과목명 과목
        r'▶\s*([^\n]+)\s*과목',  # ▶ 과목명 과목
        r'□\s*([^\n]+)\s*과목',   # □ 과목명 과목
        r'([^\n]+)\s*과목[^\n]*$'  # 과목명 과목 (마지막에 위치한 경우)
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            subject_name = match.group(1).strip()
            # 과목 번호나 불필요한 문자 제거
            subject_name = re.sub(r'^제\d+과목\s+', '', subject_name)
            subject_name = re.sub(r'\s+설계$|\s+개발$|\s+구현$', '', subject_name)
            return subject_name
    return None

def process_pdf(pdf_path):
    try:
        # PDF 파일명에서 정보 추출
        filename = os.path.basename(pdf_path)
        cert_name, year, session, initial_subject = parse_filename(filename)
        
        # Certification 객체 생성
        certification = Certification(name=cert_name, year=year, session=session)
        print("\n" + "="*50)
        print(certification)
        
        # 현재 처리 중인 SubjectExam 정보
        current_subject_name = initial_subject or "미분류"  # 초기 과목명이 없으면 "미분류"로 시작
        current_subject_exam = None
        subject_exams = []
        
        # PDF에서 문제 추출
        extractor = ExamPDFExtractor(pdf_path)
        questions = extractor.extract_questions()
        
        print(f"\n추출된 전체 문제 수: {len(questions)}")
        
        if initial_subject is None:
            print("\n주의: 파일명에 과목명이 없습니다. 문제 내용에서 과목 변경을 감지합니다.")
        
        # 문제와 답안 처리
        for idx, question in enumerate(questions, 1):
            try:
                # 과목 변경 감지 (문제 내용 또는 이전 문제에서)
                new_subject = None
                
                # 현재 문제에서 과목명 확인
                if question.get('text'):
                    new_subject = detect_subject_change(question['text'])
                
                # 이전 문제가 20의 배수이고 다음 문제가 있는 경우, 다음 문제에서도 과목명 확인
                if idx % 20 == 1 and idx < len(questions):
                    next_question = questions[idx]
                    if next_question.get('text'):
                        next_subject = detect_subject_change(next_question['text'])
                        if next_subject:
                            new_subject = next_subject
                
                if new_subject:
                    current_subject_name = new_subject
                    print(f"\n>>> 과목 변경 감지: {current_subject_name}")
                
                # 현재 과목에 대한 SubjectExam이 없으면 생성
                if not current_subject_exam or current_subject_exam.name != current_subject_name:
                    if current_subject_exam:
                        subject_exams.append(current_subject_exam)
                        print(current_subject_exam)
                    
                    current_subject_exam = SubjectExam(
                        name=current_subject_name,
                        certification=certification,
                        questions=[]
                    )
                
                # Question 객체 생성
                question_obj = Question(
                    content=question['text'],
                    image_link=question.get('image_link'),
                    subject_exam=current_subject_exam
                )
                
                # Answer 객체 생성
                if question.get('answer') is not None:
                    # 답안이 정수형인 경우 문자열로 변환
                    if isinstance(question['answer'], int):
                        answer_text = str(question['answer'])
                        explanation = "not have explanation"
                    # 답안이 딕셔너리인 경우
                    elif isinstance(question['answer'], dict):
                        answer_text = question['answer'].get('answer_text', '')
                        explanation = question['answer'].get('explanation', 'not have explanation')
                    # 답안이 Answer 객체인 경우
                    elif isinstance(question['answer'], Answer):
                        answer_text = question['answer'].answer_text
                        explanation = question['answer'].explanation
                    else:
                        answer_text = str(question['answer'])
                        explanation = "not have explanation"

                    answer_obj = Answer(
                        answer_text=answer_text,
                        explanation=explanation,
                        question=question_obj
                    )
                    question_obj.answer = answer_obj
                
                current_subject_exam.questions.append(question_obj)
                
                # 매 10번째 문제마다 현재 처리 상태 출력
                if idx % 10 == 0:
                    print(f"\n--- 현재까지 {idx}번 문제까지 처리 완료 ---")
                    print(f"현재 과목: {current_subject_name}")
                    print(f"현재 과목의 문제 수: {len(current_subject_exam.questions)}")
                
            except Exception as e:
                print(f"문제 처리 중 오류 발생: {e}")
                print(f"문제 데이터: {question}")  # 디버깅을 위한 데이터 출력
                continue
        
        # 마지막 과목 추가
        if current_subject_exam:
            subject_exams.append(current_subject_exam)
            print(current_subject_exam)
        
        # 최종 결과 출력
        certification.subject_exams = subject_exams
        print("\n" + "="*50)
        print("[최종 처리 결과]")
        print(certification)
        
        for subject_exam in subject_exams:
            print("\n" + "-"*30)
            print(subject_exam)
            if len(subject_exam.questions) > 0:
                print(f"\n처음 3개 문제 샘플:")
                for q in subject_exam.questions[:3]:
                    print(q)
            else:
                print("\n문제가 없습니다.")
        
    except Exception as e:
        print(f"PDF 처리 중 오류 발생: {e}")
        raise  # 디버깅을 위해 전체 오류 스택 출력

def process_pdf_files():
    try:
        # MySQL 연결
        db = mysql.connector.connect(
            host="localhost",  # Docker 컨테이너 이름
            user="user",            # docker-compose.yml에 정의된 MYSQL_USER
            password="1234",        # MYSQL_PASSWORD
            database="project",     # MYSQL_DATABASE
            port=3307,             # 컨테이너 내부 포트
            auth_plugin='caching_sha2_password'  # MySQL 8.0 기본 인증 방식
        )
        print("MySQL 데이터베이스에 성공적으로 연결되었습니다.")
        
        # 기존 테이블 삭제
        print("\n기존 테이블 삭제 시작...")
        drop_tables(db)
        
        # 테이블 새로 생성
        print("\n새로운 테이블 생성 시작...")
        create_tables(db)
        print("필요한 테이블이 성공적으로 생성되었습니다.")
        
        # PDF 파일 처리
        current_dir = "./exam_pdfs"
        pdf_files = [f for f in os.listdir(current_dir) if f.endswith('.pdf')]
        
        if not pdf_files:
            print("처리할 PDF 파일을 찾을 수 없습니다.")
            return
            
        for filename in pdf_files:
            pdf_path = os.path.join(current_dir, filename)
            print(f"\n처리 중인 파일: {filename}")
            process_pdf_with_db(pdf_path, db)
            
    except Exception as e:
        print(f"오류 발생: {e}")
    finally:
        if 'db' in locals():
            db.close()
            print("\nMySQL 연결이 종료되었습니다.")

def process_pdf_with_db(pdf_path, db):
    try:
        cursor = db.cursor()
        
        # PDF 파일명에서 정보 추출
        filename = os.path.basename(pdf_path)
        cert_name, year, session, initial_subject = parse_filename(filename)
        
        # 1. Certification 저장
        cursor.execute("""
            INSERT INTO certification (name, year, session) 
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), name=VALUES(name)
        """, (cert_name, year, session))
        db.commit()
        
        cert_id = cursor.lastrowid
        certification = Certification(id=cert_id, name=cert_name, year=year, session=session)
        print("\n" + "="*50)
        print(certification)
        
        # 현재 처리 중인 SubjectExam 정보
        current_subject_name = initial_subject or "미분류"
        current_subject_exam = None
        subject_exams = []
        
        # PDF에서 문제 추출
        extractor = ExamPDFExtractor(pdf_path)
        questions = extractor.extract_questions()
        
        print(f"\n추출된 전체 문제 수: {len(questions)}")
        
        if initial_subject is None:
            print("\n주의: 파일명에 과목명이 없습니다. 문제 내용에서 과목 변경을 감지합니다.")
        
        # 문제와 답안 처리
        for idx, question in enumerate(questions, 1):
            try:
                # 과목 변경 감지
                new_subject = None
                
                # 현재 문제에서 과목명 확인
                if question.get('text'):
                    new_subject = detect_subject_change(question['text'])
                
                # 이전 문제가 20의 배수이고 다음 문제가 있는 경우, 다음 문제에서도 과목명 확인
                if idx % 20 == 1 and idx < len(questions):
                    next_question = questions[idx]
                    if next_question.get('text'):
                        next_subject = detect_subject_change(next_question['text'])
                        if next_subject:
                            new_subject = next_subject
                
                if new_subject:
                    current_subject_name = new_subject
                    print(f"\n>>> 과목 변경 감지: {current_subject_name}")
                
                # 현재 과목에 대한 SubjectExam이 없으면 생성
                if not current_subject_exam or current_subject_exam.name != current_subject_name:
                    if current_subject_exam:
                        subject_exams.append(current_subject_exam)
                        print(current_subject_exam)
                    
                    # 2. SubjectExam 저장
                    cursor.execute("""
                        INSERT INTO subject_exam (name, certification_id) 
                        VALUES (%s, %s)
                        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
                    """, (current_subject_name, cert_id))
                    db.commit()
                    
                    subject_id = cursor.lastrowid
                    current_subject_exam = SubjectExam(
                        id=subject_id,
                        name=current_subject_name,
                        certification=certification,
                        questions=[]
                    )
                
                # 3. Question 저장
                cursor.execute("""
                    INSERT INTO questions (content, image_link, subject_exam_id) 
                    VALUES (%s, %s, %s)
                """, (question['text'], question.get('image_link'), current_subject_exam.id))
                
                question_id = cursor.lastrowid
                
                # Question 객체 생성
                question_obj = Question(
                    id=question_id,
                    content=question['text'],
                    image_link=question.get('image_link'),
                    subject_exam=current_subject_exam
                )
                
                # 4. Answer 저장
                if question.get('answer') is not None:
                    # 답안 데이터 처리
                    if isinstance(question['answer'], int):
                        answer_text = str(question['answer'])
                        explanation = "not have explanation"
                    elif isinstance(question['answer'], dict):
                        answer_text = question['answer'].get('answer_text', '')
                        explanation = question['answer'].get('explanation', 'not have explanation')
                    elif isinstance(question['answer'], Answer):
                        answer_text = question['answer'].answer_text
                        explanation = question['answer'].explanation
                    else:
                        answer_text = str(question['answer'])
                        explanation = "not have explanation"

                    cursor.execute("""
                        INSERT INTO answers (answer_text, explanation, question_id) 
                        VALUES (%s, %s, %s)
                    """, (answer_text, explanation, question_id))
                    
                    answer_id = cursor.lastrowid
                    answer_obj = Answer(
                        id=answer_id,
                        answer_text=answer_text,
                        explanation=explanation,
                        question=question_obj
                    )
                    question_obj.answer = answer_obj
                
                current_subject_exam.questions.append(question_obj)
                db.commit()
                
                # 진행 상황 출력
                if idx % 10 == 0:
                    print(f"\n--- 현재까지 {idx}번 문제까지 처리 완료 ---")
                    print(f"현재 과목: {current_subject_name}")
                    print(f"현재 과목의 문제 수: {len(current_subject_exam.questions)}")
                
            except Exception as e:
                print(f"문제 처리 중 오류 발생: {e}")
                print(f"문제 데이터: {question}")
                db.rollback()
                continue
        
        # 마지막 과목 추가
        if current_subject_exam:
            subject_exams.append(current_subject_exam)
            print(current_subject_exam)
        
        # 최종 결과 출력
        certification.subject_exams = subject_exams
        print("\n" + "="*50)
        print("[최종 처리 결과]")
        print(certification)
        
        for subject_exam in subject_exams:
            print("\n" + "-"*30)
            print(subject_exam)
            if len(subject_exam.questions) > 0:
                print(f"\n처음 3개 문제 샘플:")
                for q in subject_exam.questions[:3]:
                    print(q)
            else:
                print("\n문제가 없습니다.")
        
    except Exception as e:
        print(f"PDF 처리 중 오류 발생: {e}")
        db.rollback()
        raise
    finally:
        if 'cursor' in locals():
            cursor.close()

if __name__ == "__main__":
    process_pdf_files()
