import mysql.connector
from mysql.connector import Error

class DatabaseConnector:
    def __init__(self):
        self.connection = None
        self.config = {
            'host': 'localhost',          # MySQL 서버 주소
            'user': 'root',      # MySQL 사용자명
            'password': '1234',  # MySQL 비밀번호
            'database': 'project'   # 데이터베이스 이름
        }
    
    def connect(self):
        try:
            self.connection = mysql.connector.connect(**self.config)
            if self.connection.is_connected():
                print("MySQL 데이터베이스에 성공적으로 연결되었습니다.")
                self._create_tables()
                return True
        except Error as e:
            print(f"MySQL 연결 중 오류 발생: {e}")
            return False
    
    def _create_tables(self):
        """테이블 생성"""
        create_tables_queries = [
            """
            CREATE TABLE IF NOT EXISTS certifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                year INT NOT NULL,
                session VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_cert (name, year, session)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS subjects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                certification_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (certification_id) REFERENCES certifications(id),
                UNIQUE KEY unique_subject (certification_id, name)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                subject_id INT NOT NULL,
                question_number INT NOT NULL,
                content TEXT NOT NULL,
                question_type ENUM('objective', 'subjective') NOT NULL,
                choices JSON,
                image_link VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (subject_id) REFERENCES subjects(id),
                UNIQUE KEY unique_question (subject_id, question_number)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS answers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question_id INT NOT NULL,
                answer_text VARCHAR(100) NOT NULL,
                explanation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (question_id) REFERENCES questions(id),
                UNIQUE KEY unique_answer (question_id)
            )
            """
        ]
        
        try:
            cursor = self.connection.cursor()
            for query in create_tables_queries:
                cursor.execute(query)
            self.connection.commit()
            print("필요한 테이블이 성공적으로 생성되었습니다.")
        except Error as e:
            print(f"테이블 생성 중 오류 발생: {e}")
        finally:
            cursor.close()

    def insert_certification(self, name, year, session):
        query = """
        INSERT INTO certifications (name, year, session)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
        """
        return self.execute_query(query, (name, year, session))

    def insert_subject(self, certification_id, name):
        query = """
        INSERT INTO subjects (certification_id, name)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
        """
        return self.execute_query(query, (certification_id, name))

    def insert_question(self, subject_id, question_number, content, 
                       question_type, choices=None, image_link=None):
        query = """
        INSERT INTO questions 
        (subject_id, question_number, content, question_type, choices, image_link)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
        """
        return self.execute_query(query, (
            subject_id, question_number, content, 
            question_type, choices, image_link
        ))

    def insert_answer(self, question_id, answer_text, explanation=None):
        query = """
        INSERT INTO answers (question_id, answer_text, explanation)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE 
        answer_text=VALUES(answer_text),
        explanation=VALUES(explanation)
        """
        return self.execute_query(query, (question_id, answer_text, explanation))

    def execute_query(self, query, params=None):
        try:
            cursor = self.connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            if query.strip().upper().startswith('INSERT'):
                self.connection.commit()
                return cursor.lastrowid
            else:
                return cursor.fetchall()
                
        except Error as e:
            print(f"쿼리 실행 중 오류 발생: {e}")
            return None
        finally:
            cursor.close()
    
    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL 연결이 종료되었습니다.") 