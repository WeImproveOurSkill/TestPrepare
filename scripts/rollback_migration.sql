-- 마이그레이션 롤백 스크립트
-- 문제 발생시 원상복구용

-- 1. 백업에서 원본 테이블 복구
DROP TABLE IF EXISTS user_question;
CREATE TABLE user_question AS SELECT * FROM user_question_backup;

-- 2. 인덱스 복구
CREATE INDEX idx_user_question_user_status ON user_question (user_id, status);
CREATE UNIQUE INDEX uk_user_question_user_name_question ON user_question (user_id, question_id);

-- 3. 백업 테이블 삭제
-- DROP TABLE user_question_backup;

SELECT "Rollback completed" as status;