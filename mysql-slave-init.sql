-- MySQL slave 초기화 스크립트

-- 프로젝트 데이터베이스 생성 (필요시)
CREATE DATABASE IF NOT EXISTS project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 기본 권한 부여
GRANT ALL PRIVILEGES ON project.* TO 'user'@'%';
FLUSH PRIVILEGES;

-- 레플리케이션 설정
STOP SLAVE;
RESET SLAVE;

-- 마스터 서버와 연결 설정
CHANGE MASTER TO
    MASTER_HOST='mysql-master',
    MASTER_PORT=3306,
    MASTER_USER='replica',
    MASTER_PASSWORD='1234',
    MASTER_AUTO_POSITION=1;

-- 레플리케이션 시작
START SLAVE;

-- 복제 상태 확인
SHOW SLAVE STATUS\G 