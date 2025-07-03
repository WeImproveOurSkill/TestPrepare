#!/bin/sh

# MySQL 연결 확인 함수 (최대 30초 대기)
wait_for_mysql() {
    local host=$1
    local port=$2
    local max_attempts=30
    local attempt=0
    
    echo "$host:$port 연결 확인 중..."
    
    while [ $attempt -lt $max_attempts ]; do
        if nc -z $host $port 2>/dev/null; then
            echo "$host:$port 연결 성공!"
            return 0
        fi
        attempt=$((attempt + 1))
        echo "$host:$port 연결 대기 중... ($attempt/$max_attempts)"
        sleep 1
    done
    
    echo "경고: $host:$port 연결 실패, 애플리케이션을 시작합니다."
    return 1
}

# MySQL 서버들 연결 확인 (실패해도 계속 진행)
wait_for_mysql mysql-master 3306
wait_for_mysql mysql-slave 3306

echo "MySQL 준비 완료 (또는 타임아웃)"
exec java -jar /app/app.jar
