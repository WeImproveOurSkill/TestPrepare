-- MySQL master 초기화 스크립트

-- 사용자 계정 생성 (슬레이브 레플리케이션용)
CREATE USER IF NOT EXISTS 'replica'@'%' IDENTIFIED BY '1234';
GRANT REPLICATION SLAVE ON *.* TO 'replica'@'%';

-- 프로젝트 데이터베이스 생성 (docker-compose에서 생성되지만 안전을 위해 포함)
CREATE DATABASE IF NOT EXISTS project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 기본 권한 부여
GRANT ALL PRIVILEGES ON project.* TO 'user'@'%';

-- 레플리케이션 관련 설정 적용
FLUSH PRIVILEGES;
RESET MASTER;

-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS project;
USE project;

-- 기존 테이블이 있다면 삭제
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS subject_exam;
DROP TABLE IF EXISTS certification; 