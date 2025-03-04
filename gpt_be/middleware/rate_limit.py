from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

@app.on_event("startup")
async def startup():
    await FastAPILimiter.init(redis)

@router.post("/gpt-assistance", dependencies=[Depends(RateLimiter(times=10, minutes=1))])
async def get_gpt_assistance():
    # ... 기존 코드 