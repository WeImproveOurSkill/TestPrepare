-- 복제를 위한 사용자 생성
CREATE USER IF NOT EXISTS 'repl_user'@'%' IDENTIFIED BY 'repl_password';
GRANT REPLICATION SLAVE ON *.* TO 'repl_user'@'%';

-- 추가: 모든 권한 부여 (데이터 동기화를 위해)
GRANT ALL PRIVILEGES ON *.* TO 'repl_user'@'%';
FLUSH PRIVILEGES;

-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS project;
USE project;

-- 기존 테이블이 있다면 삭제
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS subject_exam;
DROP TABLE IF EXISTS certification; 