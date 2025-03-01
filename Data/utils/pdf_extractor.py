import pdfplumber
import re
import os
import json

class ExamPDFExtractor:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.exam_info = self._extract_exam_info()

    def _extract_exam_info(self):
        """파일명에서 시험 정보 추출"""
        filename = os.path.basename(self.pdf_path).lower()
        
        # 기본값 설정
        info = {
            'name': '알 수 없음',
            'year': 2024,
            'session': '1회'
        }
        
        # 자격증 이름 매핑
        cert_names = {
            '네트워크관리사': '네트워크관리사',
            '리눅스마스터': '리눅스마스터',
            '정보보안기사': '정보보안기사',
            '정보처리기사': '정보처리기사',
            '정보처리산업기사': '정보처리산업기사'
        }
        
        for key, value in cert_names.items():
            if key in filename:
                info['name'] = value
                break
        
        # 년도 추출 시도
        year_match = re.search(r'20\d{2}', filename)
        if year_match:
            info['year'] = int(year_match.group())
        
        # 회차 추출 시도
        session_match = re.search(r'(\d+)회', filename)
        if session_match:
            info['session'] = f"{session_match.group(1)}회"
        
        return info

    def preprocess_text(self, text):
        """텍스트 전처리"""
        try:
            # 특정 문자열 제거
            remove_strings = [
                "리눅스마스터 2급 2차족보(클릭)",
                "http://blog.naver.com/shadow879/220833406386",
                "리눅스마스터 2급 2차족보",
                "blog.naver.com/shadow879",
                "ctrl+f를 누르고 찾을 방향을 문서전체로 바꾸시고 검색해야 합니다.",
                # 비슷한 변형도 처리
                "ctrl + f",
                "찾을 방향을 문서전체로",
                "문서전체로 바꾸시고",
                "검색해야 합니다"
            ]
            
            for remove_str in remove_strings:
                text = text.replace(remove_str, '')
            
            # 불필요한 공백 제거
            text = ' '.join(text.split())
            
            # 연속된 줄바꿈 정리
            text = re.sub(r'\n\s*\n', '\n', text)
            
            # 불필요한 공백 문자 제거
            text = re.sub(r'\s{2,}', ' ', text)
            
            # 앞뒤 공백 제거
            return text.strip()
            
        except Exception as e:
            print(f"텍스트 전처리 중 오류 발생: {e}")
            return text

    def _is_red_text(self, char):
        """텍스트가 빨간색인지 확인"""
        try:
            # 텍스트의 non_stroking_color 확인 (RGB 값)
            color = char.get('non_stroking_color')
            if color:
                # RGB 값이 (1, 0, 0) 또는 이와 유사한 빨간색인 경우
                if isinstance(color, (list, tuple)) and len(color) == 3:
                    r, g, b = color
                    # 빨간색 판단 (R값이 높고 G,B값이 낮은 경우)
                    return r > 0.5 and g < 0.3 and b < 0.3
            return False
        except:
            return False

    def extract_questions(self):
        try:
            questions = []
            with pdfplumber.open(self.pdf_path) as pdf:
                for page_num in range(len(pdf.pages) - 1):
                    page = pdf.pages[page_num]
                    print(f"페이지 {page_num} 처리 중...")
                    
                    # 페이지 전체 텍스트를 한 번에 추출
                    text = page.extract_text()
                    
                    # 문제 블록 단위로 분리
                    question_blocks = self._split_into_question_blocks(text)
                    
                    for block in question_blocks:
                        question = self._parse_question_block(block)
                        if question:
                            questions.append(question)
                
                # 마지막 페이지에서 답안 추출
                answers = self._extract_answers(pdf.pages[-1])
                self._match_answers(questions, answers)
                
            return questions
            
        except Exception as e:
            print(f"PDF 처리 중 오류 발생: {e}")
            import traceback
            traceback.print_exc()
            return []

    def _split_into_question_blocks(self, text):
        """텍스트를 문제 단위로 분리"""
        # 문제 번호로 시작하는 패턴으로 분리
        blocks = re.split(r'(?=^\s*\d+\.)', text, flags=re.MULTILINE)
        return [b.strip() for b in blocks if b.strip()]
    
    def _parse_question_block(self, block):
        """문제 블록에서 문제 번호, 내용, 선택지 추출"""
        try:
            # 문제 번호와 내용 분리
            match = re.match(r'^\s*(\d+)\.\s*(.+?)(?=\s*[①②③④]|$)', block, re.DOTALL)
            if not match:
                return None
                
            question_num = int(match.group(1))
            question_text = match.group(2).strip()
            
            # 선택지 추출
            options = []
            option_matches = re.finditer(r'[①②③④]\s*([^①②③④]+)(?=[①②③④]|$)', block)
            for match in option_matches:
                option_text = match.group(1).strip()
                options.append(option_text)
            
            return {
                'number': question_num,
                'text': question_text,
                'options': options,
                'answer': None
            }
            
        except Exception as e:
            print(f"문제 파싱 중 오류 발생: {e}")
            return None
    
    def _extract_answers(self, page):
        """마지막 페이지에서 답안 추출"""
        answers = {}
        text = page.extract_text()
        
        # 답안 패턴 매칭 (번호. 답안 형식)
        for match in re.finditer(r'(\d+)\.\s*([①②③④]|[1-4])', text):
            question_num = int(match.group(1))
            answer_text = match.group(2)
            
            # 답안 변환
            if answer_text in '①②③④':
                answer = '①②③④'.index(answer_text) + 1
            else:
                answer = int(answer_text)
                
            answers[question_num] = answer
            
        return answers
    
    def _match_answers(self, questions, answers):
        """문제와 답안 매칭"""
        for question in questions:
            if question['number'] in answers:
                question['answer'] = answers[question['number']]

    def save_to_database(self, questions, db):
        """추출된 문제를 데이터베이스에 저장"""
        try:
            cert_id = db.insert_certification(
                self.exam_info['name'],
                self.exam_info['year'],
                self.exam_info['session']
            )
            
            if not cert_id:
                raise Exception("자격증 정보 저장 실패")
            
            subjects = {}
            for q in questions:
                if q['subject_name'] not in subjects:
                    subject_id = db.insert_subject(cert_id, q['subject_name'])
                    subjects[q['subject_name']] = subject_id
                
                subject_id = subjects[q['subject_name']]
                
                question_id = db.insert_question(
                    subject_id,
                    q['number'],
                    q['text'],
                    q['question_type'],
                    q['choices'],
                    q['image_link']
                )
                
                if question_id:
                    # 정답이 없는 경우 저장하지 않음
                    if q.get('answer'):
                        db.insert_answer(
                            question_id,
                            q['answer'],
                            None  # 해설은 별도로 처리 필요
                        )
                    else:
                        print(f"문제 {q['number']}: 정답 정보 없음")
            
            print(f"총 {len(questions)}개의 문제가 저장되었습니다.")
            
        except Exception as e:
            print(f"데이터베이스 저장 중 오류 발생: {e}")