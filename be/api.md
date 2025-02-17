# 시험 관리 시스템 API 문서

## 공통 사항
- 모든 API 요청에는 인증이 필요합니다.
- Request Header에 다음 정보가 포함되어야 합니다:
  ```
  Authorization: Bearer {JWT_TOKEN}
  Content-Type: application/json
  ```

## 1. 자격증 관리 API

### 1.1 자격증 목록 조회
- **설명**: 전체 자격증 목록을 조회합니다.
- **Method**: GET
- **URL**: `/exam`
- **Response**:
```json
[
  {
    "certificationId": "Long",
    "certificationName": "String"
  }
]
```

### 1.2 자격증별 과목 목록 조회
- **설명**: 특정 자격증의 과목 목록을 조회합니다.
- **Method**: GET
- **URL**: `/exam/certification/{certificationId}`
- **Path Variable**:
  - certificationId: Long
- **Response**:
```json
[
  {
    "subjectId": "Long",
    "subjectName": "String"
  }
]
```

## 2. 문제 관리 API

### 2.1 기출문제 세트 조회
- **설명**: 자격증의 연도/회차별 기출문제를 조회합니다.
- **Method**: GET
- **URL**: `/exam/certification`
- **Query Parameters**:
  - name: String (자격증명)
  - year: Integer (시험연도)
  - session: String (시험회차)
- **Response**:
```json
[
  {
    "questionId": "Long",
    "question": "String",
    "questionType": "ENUM(객관식/주관식)",
    "choices": "String (JSON)",
    "answer": "String",
    "explanation": "String"
  }
]
```

### 2.2 과목별 랜덤 문제 조회
- **설명**: 특정 과목의 랜덤 문제를 조회합니다.
- **Method**: GET
- **URL**: `/exam/subject/{subjectId}/random`
- **Path Variable**:
  - subjectId: Long
- **Query Parameter**:
  - questionId: Long (이전 문제 ID, 기본값: -1)
- **Response**: 2.1의 Response 객체와 동일

## 3. 문제 풀이 API

### 3.1 시험 모드 답안 제출
- **설명**: 시험 모드에서 풀이한 답안을 제출합니다.
- **Method**: POST
- **URL**: `/exam/submit/test`
- **Request Body**:
```json
[
  {
    "questionId": "Long",
    "answer": "String",
    "userAnswer": "String"
  }
]
```
- **Response**: HTTP 200 OK

### 3.2 일반 문제 풀이 제출
- **설명**: 일반 모드에서 문제 풀이 결과를 기록합니다.
- **Method**: POST
- **URL**: `/exam/submit/normal`
- **Request Body**:
```json
{
  "questionId": "Long",
  "status": "ENUM"
}
```
- **Response**: HTTP 200 OK

### 3.3 오답 문제 조회
- **설명**: 사용자의 오답 문제 목록을 조회합니다.
- **Method**: GET
- **URL**: `/exam/wrong-questions`
- **Query Parameter**:
  - status: Enum (문제 상태)
- **Response**: 2.1의 Response 배열과 동일

## 4. 북마크 관리 API

### 4.1 북마크 상태 변경
- **설명**: 문제의 북마크 상태를 토글합니다.
- **Method**: PATCH
- **URL**: `/exam/book-mark`
- **Query Parameter**:
  - questionId: Long
- **Response**: HTTP 200 OK

### 4.2 북마크된 문제 조회
- **설명**: 특정 자격증의 북마크된 문제들을 조회합니다.
- **Method**: GET
- **URL**: `/exam/book-mark/question`
- **Query Parameter**:
  - certificationId: Long
- **Response**: 2.1의 Response 배열과 동일

## 에러 응답
모든 API는 다음과 같은 에러 응답을 반환할 수 있습니다:
- 400 Bad Request: 잘못된 요청
- 401 Unauthorized: 인증 실패
- 403 Forbidden: 권한 없음
- 404 Not Found: 리소스를 찾을 수 없음
- 500 Internal Server Error: 서버 오류

이 API 문서는 현재 구현된 기능을 기준으로 작성되었으며, 추가적인 기능 구현 시 문서가 업데이트될 수 있습니다.