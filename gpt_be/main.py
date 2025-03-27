from fastapi import FastAPI, Depends
# from routers import recommendation, crawl  # crawl 임시 제거
from routers import recommendation
from middleware.auth_middleware import AuthMiddleware
from utils.auth import auth_handler
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys
import ssl  # ssl 모듈 추가
import uvicorn

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("main")

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8444,
        ssl_keyfile="/app/ssl/private.key",
        ssl_certfile="/app/ssl/certificate.crt"
    )
import sys

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("main")
logger.info("애플리케이션 시작")

app = FastAPI()
router = APIRouter()

# SSL 컨텍스트 설정
ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain(
    certfile="/app/ssl/certificate.crt",
    keyfile="/app/ssl/private.key"
)

app.add_middleware(AuthMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


# FastAPI에서 토큰 검증 예시
@router.get("/protected")
async def protected_route(
    current_user: dict = Depends(auth_handler.auth_wrapper)
):
    return {"user_id": current_user.get("user_id")}

# 크롤링 라우터 추가 (임시 주석 처리)
# app.include_router(crawl.router)
app.include_router(router)
app.include_router(recommendation.router)

logger.info("모든 라우터 설정 완료")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8444,
        ssl_keyfile="/app/ssl/private.key",
        ssl_certfile="/app/ssl/certificate.crt"
    )