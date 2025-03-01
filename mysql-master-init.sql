-- 복제를 위한 사용자 생성
CREATE USER IF NOT EXISTS 'repl_user'@'%' IDENTIFIED BY 'repl_password';
GRANT REPLICATION SLAVE ON *.* TO 'repl_user'@'%';
FLUSH PRIVILEGES;

-- 데이터베이스 선택
USE project;

-- 기존 테이블이 있다면 삭제
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS subject_exam;
DROP TABLE IF EXISTS certification; 