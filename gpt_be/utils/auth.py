from jose import JWTError, jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger("auth_handler")

class AuthHandler:
    def __init__(self):
        self.secret = os.getenv("JWT_SECRET_KEY")
        if not self.secret:
            logger.error("JWT_SECRET_KEY 환경변수가 설정되지 않았습니다")
        self.algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        logger.debug(f"인증 핸들러 초기화: 알고리즘={self.algorithm}")
        self.security = HTTPBearer()

    def decode_token(self, token: str):
        try:
            logger.debug(f"토큰 디코딩 시도: {token[:10]}...")
            payload = jwt.decode(
                token, 
                self.secret, 
                algorithms=[self.algorithm]
            )
            logger.debug(f"토큰 디코딩 성공: {payload}")
            return payload
        except JWTError as e:
            logger.error(f"JWT 디코딩 오류: {str(e)}")
            raise HTTPException(
                status_code=401, 
                detail="Invalid authentication credentials"
            )
    
    async def auth_wrapper(self, auth: HTTPAuthorizationCredentials = Security(HTTPBearer())) -> dict:
        try:
            logger.debug("인증 래퍼 호출됨")
            logger.debug(f"인증 정보: {auth.scheme} {auth.credentials[:10]}...")
            if auth.scheme.lower() != "bearer":
                logger.warning(f"인증 스키마 오류: {auth.scheme} (bearer가 아님)")
                raise HTTPException(
                    status_code=401,
                    detail="Invalid authentication scheme"
                )
            return self.decode_token(auth.credentials)
        except Exception as e:
            logger.error(f"인증 래퍼 오류: {str(e)}")
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials"
            )

auth_handler = AuthHandler()