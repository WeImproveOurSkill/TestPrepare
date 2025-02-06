# 시험 관리 시스템 API 문서

## 1. 자격증 관리 API

### 1.1 자격증 목록 조회
- **기능설명**: 사용자가 선택할 수 있는 모든 자격증 목록을 조회합니다.
- **URL**: `GET /exam`
- **Response**:
```typescript
[
  {
    certificationId: Long,    // 자격증 고유 ID
    certificationName: String // 자격증 이름
  }
]
```


### 1.2 자격증별 과목 목록 조회
- **기능설명**: 선택한 자격증에 해당하는 과목 목록을 조회합니다.
- **URL**: `GET /exam/certification/{certificationId}`
- **Path Variable**:
  - certificationId: Long (자격증 ID)
- **Response**:
```typescript
[
  {
    subjectId: Long,    // 과목 고유 ID
    subjectName: String // 과목 이름
  }
]
```


## 2. 문제 관리 API

### 2.1 기출문제 세트 조회
- **기능설명**: 특정 자격증의 연도/회차별 기출문제를 조회합니다.
- **URL**: `GET /exam/certification`
- **Query Parameters**:
  - name: String (자격증 이름)
  - year: Integer (시험 연도)
  - session: String (시험 회차)
- **Response**:
```typescript
[
  {
    questionId: Long,           // 문제 고유 ID
    question: String,          // 문제 내용
    questionType: Enum,        // 문제 유형 (객관식/주관식)
    choices: String,           // 선택지 (JSON 형식)
    answer: String,           // 정답
    explanation: String       // 해설
  }
]
```


### 2.2 과목별 랜덤 문제 조회
- **기능설명**: 특정 과목의 랜덤 문제를 한 문제씩 조회합니다.
- **URL**: `GET /exam/subject/{subjectId}/random`
- **Path Variable**:
  - subjectId: Long (과목 ID)
- **Query Parameter**:
  - questionId: Long (이전 문제 ID, 기본값: -1)
- **Response**: QuestionDto (2.1의 Response 객체와 동일)

## 3. 문제 풀이 API

### 3.1 시험 모드 답안 제출
- **기능설명**: 시험 모드에서 풀이한 답안을 제출하고 결과를 기록합니다.
- **URL**: `POST /exam/submit/test`
- **Request Body**:
```typescript
[
  {
    questionId: Long,    // 문제 ID
    answer: String,     // 정답
    userAnswer: String  // 사용자 답안
  }
]
```

- **Response**: void (HTTP 200 OK)
- **동작설명**: 
  - 사용자가 제출한 답안을 처리하여 UserQuestion 엔티티에 기록
  - 각 문제별 정답/오답 여부를 저장
  - 별도의 응답 데이터 없이 성공 여부만 반환


### 3.2 일반 문제 풀이 제출
- **기능설명**: 일반 모드에서 문제 풀이 결과를 기록합니다.
- **URL**: `POST /exam/submit/normal`
- **Request Body**:
```typescript
{
  questionId: Long,        // 문제 ID
  status: Enum            // 문제 풀이 상태
}
```


### 3.3 오답 문제 조회
- **기능설명**: 사용자의 오답 문제 목록을 조회합니다.
- **URL**: `GET /exam/wrong-questions`
- **Query Parameter**:
  - status: Enum (문제 상태)
- **Response**: QuestionDto[] (2.1의 Response 배열)

## 보안 사항
- 모든 API는 인증된 사용자만 접근 가능합니다.
- 사용자 인증은 JWT 토큰을 사용합니다.
- 인증 헤더: `Authorization: Bearer {token}`

## 에러 처리
- 400 Bad Request: 잘못된 요청 파라미터
- 401 Unauthorized: 인증 실패
- 403 Forbidden: 권한 없음
- 404 Not Found: 리소스 없음
- 500 Internal Server Error: 서버 오류

이 API 문서는 현재 구현된 기능을 기준으로 작성되었으며, 추가적인 기능 구현 시 문서가 업데이트될 수 있습니다.