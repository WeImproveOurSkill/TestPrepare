from jose import JWTError, jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer
import os
from dotenv import load_dotenv

load_dotenv()

class AuthHandler:
    def __init__(self):
        self.secret = os.getenv("JWT_SECRET_KEY")
        self.algorithm = os.getenv("JWT_ALGORITHM", "HS256")

    def decode_token(self, token: str):
        try:
            payload = jwt.decode(
                token, 
                self.secret, 
                algorithms=[self.algorithm]
            )
            return payload
        except JWTError:
            raise HTTPException(
                status_code=401, 
                detail="Invalid authentication credentials"
            )

auth_handler = AuthHandler()