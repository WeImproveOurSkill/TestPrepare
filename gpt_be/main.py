from fastapi import FastAPI
from routers import recommendation
from middleware.auth_middleware import AuthMiddleware
from utils.auth import auth_handler

app = FastAPI()
app.add_middleware(AuthMiddleware)


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

app.include_router(recommendation.router)
