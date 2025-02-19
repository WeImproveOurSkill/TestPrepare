from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from utils.auth import auth_handler

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if "Authorization" in request.headers:
            try:
                token = request.headers["Authorization"].split(" ")[1]
                token_data = auth_handler.decode_token(token)
                request.state.user = token_data
            except Exception:
                pass
        
        response = await call_next(request)
        return response