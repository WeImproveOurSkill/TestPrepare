-- MSA 전환을 위한 user_question 테이블 마이그레이션
-- 목적: user_id (BIGINT) -> user_name (VARCHAR) 변환

-- 1. 현재 테이블 구조 확인
DESCRIBE user_question;

-- 2. 데이터 백업 테이블 생성
CREATE TABLE user_question_backup AS 
SELECT * FROM user_question;

-- 3. user_name 컬럼 추가
ALTER TABLE user_question 
ADD COLUMN user_name VARCHAR(255) AFTER id;

-- 4. 기존 데이터 변환 (user_id -> username)
-- user 테이블에서 username을 가져와서 user_name에 설정
UPDATE user_question uq 
JOIN user u ON uq.user_id = u.id 
SET uq.user_name = u.username
WHERE uq.user_id IS NOT NULL;

-- 5. 데이터 변환 확인
SELECT 
    COUNT(*) as total_records,
    COUNT(user_name) as converted_records,
    COUNT(user_id) as original_records
FROM user_question;

-- 6. user_name에 NOT NULL 제약조건 추가
ALTER TABLE user_question 
MODIFY COLUMN user_name VARCHAR(255) NOT NULL;

-- 7. 기존 user_id 컬럼 삭제
-- ALTER TABLE user_question DROP COLUMN user_id;

-- 8. 인덱스 재생성
DROP INDEX IF EXISTS idx_user_question_user_status ON user_question;
CREATE INDEX idx_user_question_user_status ON user_question (user_name, status);

-- 9. 유니크 제약조건 재생성
DROP INDEX IF EXISTS uk_user_question_user_name_question ON user_question;
CREATE UNIQUE INDEX uk_user_question_user_name_question ON user_question (user_name, question_id);

-- 10. 최종 테이블 구조 확인
DESCRIBE user_question;
SELECT COUNT(*) as final_count FROM user_question WHERE user_name IS NOT NULL;