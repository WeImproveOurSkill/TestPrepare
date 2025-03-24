import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from utils.logger import log_request_info, log_response_info, log_error

class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, logger):
        super().__init__(app)
        self.logger = logger
        
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # 요청 로깅
        log_request_info(self.logger, request)
        
        try:
            # 다음 미들웨어 또는 라우터 호출
            response = await call_next(request)
            
            # 처리 시간 계산
            process_time = (time.time() - start_time) * 1000
            
            # 응답 로깅
            log_response_info(self.logger, response, process_time)
            
            return response
            
        except Exception as e:
            # 에러 로깅
            log_error(self.logger, e, request)
            
            # 에러 응답 생성
            error_detail = str(e)
            if hasattr(e, "detail"):
                error_detail = e.detail
                
            return Response(
                content=f'{{"detail": "{error_detail}"}}',
                status_code=500,
                media_type="application/json"
            ) 