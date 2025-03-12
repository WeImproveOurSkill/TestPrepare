from fastapi import FastAPI, Depends
# from routers import recommendation, crawl  # crawl 임시 제거
from routers import recommendation
from middleware.auth_middleware import AuthMiddleware
from utils.auth import auth_handler
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter

app = FastAPI()
router = APIRouter()

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
