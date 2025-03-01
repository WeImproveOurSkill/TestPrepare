-- 복제 설정
STOP SLAVE;

CHANGE MASTER TO
    MASTER_HOST='database-master',
    MASTER_USER='repl_user',
    MASTER_PASSWORD='repl_password',
    MASTER_AUTO_POSITION=1;

START SLAVE;

-- 복제 상태 확인
SHOW SLAVE STATUS\G 