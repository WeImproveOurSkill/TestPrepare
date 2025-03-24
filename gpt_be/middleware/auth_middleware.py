from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from utils.auth import auth_handler
import logging

logger = logging.getLogger("auth_middleware")

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger.debug(f"인증 미들웨어 처리 시작: {request.method} {request.url.path}")

        if "Authorization" in request.headers:
            try:
                auth_header = request.headers["Authorization"]
                logger.debug(f"Authorization 헤더: {auth_header}")
                
                # Bearer 토큰 형식 검증
                if not auth_header.startswith("Bearer "):
                    logger.warning("인증 헤더 형식 오류: Bearer 형식이 아님")
                else:
                    token = auth_header.split(" ")[1]
                    logger.debug("토큰 디코딩 시도")
                    token_data = auth_handler.decode_token(token)
                    request.state.user = token_data
                    logger.debug(f"토큰 디코딩 성공: {token_data}")
            except IndexError:
                logger.error("인증 헤더 형식 오류: 토큰 분리 실패")
            except Exception as e:
                logger.error(f"토큰 디코딩 실패: {str(e)}")
        else:
            logger.debug("Authorization 헤더 없음 - 인증되지 않은 요청")
        
        logger.debug("다음 미들웨어 또는 라우터 호출")
        response = await call_next(request)
        logger.debug(f"응답 상태 코드: {response.status_code}")
        
        return response