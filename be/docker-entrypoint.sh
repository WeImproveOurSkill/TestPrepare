#!/bin/bash

# MySQL 서비스가 준비될 때까지 대기
while ! nc -z mysql_db 3306; do
  echo "MySQL 서버 대기중..."
  sleep 1
done

echo "MySQL 서버 준비완료!"

# Spring Boot 애플리케이션 실행
exec java -jar /app/build/libs/be-0.0.1-SNAPSHOT.jar 