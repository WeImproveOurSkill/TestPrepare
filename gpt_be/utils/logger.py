import logging
import sys
from datetime import datetime

# 로그 포맷 설정
log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
date_format = "%Y-%m-%d %H:%M:%S"

# 로그 설정
def setup_logger(name, log_level=logging.DEBUG):
    logger = logging.getLogger(name)
    logger.setLevel(log_level)
    
    # 콘솔 핸들러 추가
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(log_format, datefmt=date_format))
    logger.addHandler(console_handler)
    
    return logger

# API 요청/응답 로깅 함수
def log_request_info(logger, request, body=None):
    client_host = request.client.host if request.client else "unknown"
    logger.info(f"Request: {request.method} {request.url.path} - Client: {client_host}")
    logger.debug(f"Headers: {request.headers}")
    if body:
        logger.debug(f"Body: {body}")

def log_response_info(logger, response, processing_time=None):
    logger.info(f"Response: Status {response.status_code}")
    if processing_time:
        logger.debug(f"Processing Time: {processing_time:.2f}ms")
    
def log_error(logger, error, request=None):
    if request:
        logger.error(f"Error in {request.method} {request.url.path}: {str(error)}")
    else:
        logger.error(f"Error: {str(error)}") 