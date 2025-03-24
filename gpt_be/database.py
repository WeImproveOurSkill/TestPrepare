from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import pymysql
import re

load_dotenv()

# PyMySQL을 MySQL 드라이버로 등록
pymysql.install_as_MySQLdb()

# DATABASE_URL 형식 변경 (mysql:// -> mysql+pymysql://)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
if SQLALCHEMY_DATABASE_URL.startswith('mysql://'):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace('mysql://', 'mysql+pymysql://')

# 지원되지 않는 매개변수 제거 (serverTimezone, characterEncoding 등)
if '?' in SQLALCHEMY_DATABASE_URL:
    # URL에서 쿼리 파라미터 추출
    base_url, query_params = SQLALCHEMY_DATABASE_URL.split('?', 1)
    
    # 지원되지 않는 매개변수 필터링
    if query_params:
        filtered_params = []
        unsupported_params = ['serverTimezone', 'characterEncoding']
        
        for param in query_params.split('&'):
            param_name = param.split('=')[0] if '=' in param else param
            if param_name not in unsupported_params:
                filtered_params.append(param)
        
        # 수정된 쿼리 파라미터로 URL 재구성
        if filtered_params:
            SQLALCHEMY_DATABASE_URL = f"{base_url}?{'&'.join(filtered_params)}"
        else:
            SQLALCHEMY_DATABASE_URL = base_url

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