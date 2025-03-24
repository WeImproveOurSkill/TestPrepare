from fastapi import FastAPI, Depends
# from routers import recommendation, crawl  # crawl 임시 제거
from routers import recommendation
# from middleware.auth_middleware import AuthMiddleware  # 인증 미들웨어 제거
from middleware.logging_middleware import LoggingMiddleware
# from utils.auth import auth_handler  # 인증 핸들러 제거
from utils.logger import setup_logger
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
import logging

# 로깅 설정
app_logger = setup_logger("app", logging.DEBUG)
# auth_logger = setup_logger("auth_middleware", logging.DEBUG)  # 인증 관련 로거 제거
recommendation_logger = setup_logger("recommendation", logging.DEBUG)
# auth_handler_logger = setup_logger("auth_handler", logging.DEBUG)  # 인증 관련 로거 제거
fallback_logger = setup_logger("fallback", logging.DEBUG)
perplexity_logger = setup_logger("perplexity", logging.DEBUG)

app = FastAPI()
router = APIRouter()

# CORS 설정 - 모든 출처 허용으로 변경
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://localhost:3000",
    "https://kauth.kakao.com",
    "http://220.85.221.62",
    "http://223.131.169.45"
]

# 미들웨어 추가
app.add_middleware(LoggingMiddleware, logger=app_logger)  # 로깅 미들웨어 먼저 추가
# app.add_middleware(AuthMiddleware)  # 인증 미들웨어 제거

# 첫 번째 CORS 미들웨어: 특정 출처 허용, credentials 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Authorization", "Refresh"]
)

# 두 번째 CORS 미들웨어: 모든 출처 허용, credentials 미허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"]
)

# 시작 로그
@app.on_event("startup")
async def startup_event():
    app_logger.info("애플리케이션 시작")


@app.get("/")
async def root():
    app_logger.info("루트 경로 요청 받음")
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    app_logger.info(f"hello/{name} 경로 요청 받음")
    return {"message": f"Hello {name}"}


# 인증 예시 엔드포인트(토큰 인증 제거됨)
@router.get("/protected")
async def protected_route():
    app_logger.info("보호된 경로 접근(인증 없음)")
    return {"message": "인증 없이 접근 가능한 보호된 경로입니다."}

# 크롤링 라우터 추가 (임시 주석 처리)
# app.include_router(crawl.router)
app.include_router(router)
app.include_router(recommendation.router)

# 종료 로그
@app.on_event("shutdown")
async def shutdown_event():
    app_logger.info("애플리케이션 종료")
