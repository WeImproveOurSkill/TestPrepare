from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter(
    prefix="/api/crawl",
    tags=["crawl"]
)

@router.get("/titles")
async def get_crawled_titles() -> List[str]:
    try:
        # 여기에 크롤링 로직 구현
        # 예시 응답
        return ["제목1", "제목2", "제목3"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 