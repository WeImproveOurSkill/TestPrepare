from fastapi import Request
from fastapi.middleware.base import BaseHTTPMiddleware

class RoleMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        user = request.state.user
        if user and "role" in user:
            request.state.user_role = user["role"]
        response = await call_next(request)
        return response 