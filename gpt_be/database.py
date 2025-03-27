from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import pymysql

load_dotenv()

# PyMySQL을 MySQL 드라이버로 등록
pymysql.install_as_MySQLdb()

# Docker 환경에서 DB 연결 정보 가져오기
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3307")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "1234")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "project")

# DATABASE_URL 생성 (Docker 환경 변수 또는 .env 파일 사용)
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
)

# MySQL 연결 설정
if SQLALCHEMY_DATABASE_URL.startswith('mysql'):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        pool_recycle=1800
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 