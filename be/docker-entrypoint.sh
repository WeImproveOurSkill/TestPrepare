#!/bin/sh

# MySQL 서비스가 준비될 때까지 대기
while ! nc -z mysql-master 3306; do
  echo "MySQL-master서버 대기중..."
  sleep 1
done

# MySQL 슬레이브는 선택적으로 확인
while ! nc -z mysql-slave 3306; do
  echo "MySQL-slave 서버 대기중..."
  sleep 1
done

echo "MySQL 서버 준비완료!"

# Spring Boot 애플리케이션 실행
exec java -jar /app/app.jar 