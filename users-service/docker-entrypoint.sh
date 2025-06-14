#!/bin/sh


while !nc -z mysql-master 3306; do
  echo "MySQL-master 서버 대기중"
  sleep 1
done


while !nc -z mysql-slave 3306; do
  echo "MySQL-slave 서버 대기중"
  sleep 1
done

echo "MySQL 준비 완료"
exec java -jar /app/app.jar
