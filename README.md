# TestPrepare 프로젝트

## 1. 프로젝트 소개

TestPrepare는 다양한 자격증 시험을 준비하는 사용자들을 돕기 위한 종합 학습 애플리케이션입니다. 이 프로젝트는 사용자의 학습 효율성을 높이고, 개인화된 학습 경험을 제공하기 위해 설계되었습니다.

프로젝트는 마이크로서비스 아키텍처를 채택하여 Spring Boot와 FastAPI 기반의 백엔드, React Native 기반의 프론트엔드, 그리고 MySQL 마스터-슬레이브 구성과 Redis 캐싱을 포함하는 인프라로 구성되어 있습니다. 이러한 구성은 높은 확장성과 성능을 보장합니다.

Docker와 Docker Compose를 활용한 컨테이너화 전략을 통해 개발 및 배포 환경의 일관성을 유지하고, Nginx를 통한 리버스 프록시 설정으로 트래픽을 효율적으로 관리합니다.

---

- 프로젝트 아키텍쳐 레이어
    
    ```mermaid
    flowchart TB
        subgraph Client["클라이언트"]
            front["Front-End\n(React Native)"]
            app["Mobile App"]
        end
    
        subgraph ProxyLayer["프록시 레이어"]
            nginx["Nginx\n리버스 프록시"]
        end
    
        subgraph BackendLayer["백엔드 레이어"]
            spring["Spring Boot\n(spring-app)\n:8080"]
            gpt["FastAPI\n(gpt-app)\n:8000"]
        end
    
        subgraph CacheLayer["캐시 레이어"]
            redis["Redis\n(redis-cache)\n:6379"]
            redis_token["Redis\n(redis-token)\n:6380"]
        end
    
        subgraph DatabaseLayer["데이터베이스 레이어"]
            subgraph MasterSlave["MySQL 마스터-슬레이브"]
                mysql_master["MySQL Master\n(database-master)\n:3307"]
                mysql_slave["MySQL Slave\n(database-slave)\n:3308"]
            end
        end
    
        front --> nginx
        app --> nginx
        
        nginx --> spring
        nginx --> gpt
    
        spring --> redis
        spring --> redis_token
        spring --> mysql_master
        spring --> mysql_slave
    
        gpt --> mysql_master
    
        mysql_master --> mysql_slave
        
        classDef frontEnd fill:#ff9900,stroke:#333,stroke-width:2px
        classDef proxy fill:#00bfff,stroke:#333,stroke-width:2px
        classDef backend fill:#32cd32,stroke:#333,stroke-width:2px
        classDef cache fill:#ff69b4,stroke:#333,stroke-width:2px
        classDef database fill:#9370db,stroke:#333,stroke-width:2px
        
        class front,app frontEnd
        class nginx proxy
        class spring,gpt backend
        class redis,redis_token cache
        class mysql_master,mysql_slave database
    ```
    
- 피그마
    
    [https://embed.figma.com/design/KjM6JHU6t6uoZuqj0wvozq/Cursor-TestPrepare?t=V2XS0CXXmp5lXzFD-0&embed-host=notion&footer=false&theme=system](https://embed.figma.com/design/KjM6JHU6t6uoZuqj0wvozq/Cursor-TestPrepare?t=V2XS0CXXmp5lXzFD-0&embed-host=notion&footer=false&theme=system)
    
- 프로젝트 ERD
    
    ```mermaid
    erDiagram
        %% Core Entities
        User {
            Long id PK
            String username
            String password
            String email
            String nickname
            String oauth2Id
            Role role
            String provider
            String providerId
        }
    
        Question {
            Long id PK
            String content
            String imageLink
            Long subject_exam_id FK
        }
    
        Answer {
            Long id PK
            String answerText
            String explanation
            Long question_id FK
        }
    
        %% Certification Related
        Certification {
            Long id PK
            String name
        }
    
        CertificationType {
            Long id PK
            int year
            int session
            Long certification_id FK
        }
    
        SubjectExam {
            Long id PK
            String name
            Long certification_id FK
        }
    
        %% Junction Tables
        CertificationSubject {
            Long id PK
            Long certification_type_id FK
            Long subject_exam_id FK
        }
    
        UserCertification {
            Long id PK
            Long user_id FK
            Long certification_id FK
            LocalDateTime acquiredDate
            Integer score
            String status
        }
    
        UserQuestion {
            Long id PK
            Long user_id FK
            Long question_id FK
            Status status
            LocalDateTime solveTime
            Boolean isBookmarked
        }
    
        %% Relationships
        User ||--o{ UserCertification : has
        User ||--o{ UserQuestion : solves
        Certification ||--o{ UserCertification : belongs_to
        Certification ||--o{ SubjectExam : contains
        Certification ||--o{ CertificationType : has
        CertificationType ||--o{ CertificationSubject : links
        SubjectExam ||--o{ Question : contains
        SubjectExam ||--o{ CertificationSubject : links
        Question ||--|| Answer : has
        Question ||--o{ UserQuestion : answered_by
    ```
    
- 시스템 흐름도
    
    ```mermaid
    graph LR
        A[사용자] --> B{프론트엔드 APP}
        B --> C[Spring Boot API]
        B --> D[FastAPI AI 엔진]
        C --> E[(MySQL DB)]
        C --> F[(Redis Cache)]
        D --> G[데이터 처리 파이프라인]
        G --> E[(MySQL DB)]
        F --> H[빈도 높은 요청 캐시 데이터]
    
    ```
    
- 시험 문제 데이터 파싱 처리
    
    ```mermaid
    flowchart TB
        subgraph InputData["입력 데이터"]
            pdf["PDF 문제집 파일"]
        end
    
        subgraph PDFProcessing["PDF 처리 과정"]
            extract["PDF 텍스트 추출\n(PDFExtractor)"]
            preprocess["텍스트 전처리\n(불필요한 문자 제거, 포맷팅)"]
            parse["문제 및 답안 추출\n(문제, 선택지, 정답 분리)"]
            validate["데이터 검증\n(중복, 오류 검사)"]
        end
    
        subgraph DataModeling["데이터 모델링"]
            question["문제(Question)\n- 내용\n- 이미지 링크"]
            answer["답안(Answer)\n- 답안 텍스트\n- 해설"]
            subject["과목(SubjectExam)\n- 이름"]
            cert["자격증(Certification)\n- 이름"]
            certType["자격증 유형(CertificationType)\n- 년도\n- 회차"]
            relation["관계 테이블(CertificationSubject)\n- 자격증 유형 연결\n- 과목 연결"]
        end
    
        subgraph DatabaseOps["데이터베이스 작업"]
            connect["DB 연결\n(MySQL)"]
            createTables["테이블 생성"]
            insertData["데이터 삽입\n(SQL INSERT)"]
            verifySql["데이터 검증 쿼리\n(무결성 확인)"]
        end
    
        %% 입력 데이터에서 PDF 처리 과정으로
        pdf --> extract
        
        %% PDF 처리 과정 내부 흐름
        extract --> preprocess
        preprocess --> parse
        parse --> validate
        
        %% 데이터 모델링과 검증된 데이터 연결
        validate --> question
        validate --> answer
        validate --> subject
        validate --> cert
        validate --> certType
        validate --> relation
    
        %% 데이터 모델 간의 관계
        question --> answer
        question --> subject
        subject --> cert
        cert --> certType
        certType --> relation
        subject --> relation
        
        %% 데이터베이스 작업 흐름
        connect --> createTables
        question --> insertData
        answer --> insertData
        subject --> insertData
        cert --> insertData
        certType --> insertData
        relation --> insertData
        insertData --> verifySql
        
        %% 스타일 지정
        classDef input fill:#ffcc99,stroke:#333,stroke-width:2px
        classDef process fill:#ccffcc,stroke:#333,stroke-width:2px
        classDef model fill:#99ccff,stroke:#333,stroke-width:2px
        classDef database fill:#cc99ff,stroke:#333,stroke-width:2px
        
        class pdf input
        class extract,preprocess,parse,validate process
        class question,answer,subject,cert,certType,relation model
        class connect,createTables,insertData,verifySql database
    ```
    

[api 명세서](TestPrepare%20프로젝트%2017b196aab73280c780e8ee152c458fec/API%20명세서%20a8e5057b480e4dfe97d6db11541f755f.md)


---

## 2. 프로젝트 팀원 역할

|  | 이현동 | 김민수 |
| --- | --- | --- |
| 역할 | 프론트엔드, 앱 | 백엔드, 배포환경 |
| 기능 | - 크로스 플랫폼으로 개발(React Native)
- TypeScript를 이용한 프로젝트 개발
- OAuth2.0 기반 구글, 카카오 소셜 로그인 및 회원가입 구현
- Tanstack-query를 사용한 데이터 캐싱 구현 | - 기본 백엔드 기능 구현(Spring)
- Jwt를 사용한 보안 구현
- Perplexity API 및 프롬프트 사용(FastAPI)
- Docker compose를 통한 멀티 컨테이너 환경 구현(홈서버 구축), 네트워크 세팅
- Mysql, Redis, Nginx를 통한 아키텍쳐 설계 및 구현 |

### 2.1 프론트엔드 (front 폴더)

### **2.1.1 인증 및 사용자 관리**

- **JWT 토큰 기반 인증 시스템**: encryptStorage를 통한 보안 토큰 저장 및 관리, 자동 토큰 갱신 처리
- **소셜기반  로그인 및 회원가입 연동 기능**: 카카오, 구글 등 OAuth 인증 연동 및 토큰 관리

### **2.1.2 문제 풀이 모듈**

- **시험 모드 구현**: 실제 시험 환경과 유사한 타이머 기능, 답안 일괄 제출, 문제 이동 제한 설정
- **학습 모드 구현**: 즉시 정답 피드백 제공, 정답 해설 접근, 반복 학습 기능
- **오답노트 관리**: 틀린 문제 자동 저장, 카테고리별 정렬, 다시 풀기
- **북마크 기능**: 중요 문제 표시 및 별도 관리, 빠른 접근 기능
- **문제 설명 모달**: 상세 해설 기능

### **2.1.3 데이터 관리**

- **React Query 활용**: 서버 데이터 캐싱 전략, 자동 재요청, 백그라운드 데이터 동기화, 로딩/에러 상태 관리
- **자격증 선택 및 관리**: 다양한 자격증 데이터베이스 연동, 맞춤형 학습 계획 설정, 시험 일정 알림

### **2.1.4 UI/UX 기능**

- **테마 지원**: 사용자 선호에 따른 다크/라이트 모드 전환, 시스템 설정 연동
- **반응형 디자인**: 태블릿/모바일 레이아웃 최적화, 화면 크기별 컴포넌트 재배치, 동적 폰트 크기 조정
- **문제 페이징 시스템**: 릴스와 비슷한 위아래 스와이프 UI, 페이지 북마크
- **문제 및 선택지 렌더링**: 다양한 문제 형식(객관식, 주관식, 복수 선택) 지원

### **2.1.5 내비게이션 구조**

- **탭 기반 메인 내비게이션**: 탭 간 데이터 보존
- **앱 내 경로 관리**: 일관된 경로 명명 규칙, 화면 간 이동 최적화, 경로 상수화

### **2.1.6 성능 최적화**

- **메모이제이션 기법**: 불필요한 렌더링 방지, 함수 재생성 최소화
- **지연 로딩 및 페칭 최적화**: 필요 시점에만 데이터 로드, 무한 스크롤, 데이터 프리페칭

### **2.1.7 데이터 파싱 및 처리**

- **문제 데이터 파싱**: 다양한 형식(텍스트, HTML, 마크다운)의 문제 내용 정규화, 구조화된 데이터 변환
- **선택지 추출 및 처리**: 번호/알파벳 자동 인식, 정답 오답 처리
- **API 응답 데이터 타입**: 타입스크립트 인터페이스 정의, 런타임 타입 검증, 데이터 변환 유틸리티

### **2.1.8 학습 진도 관리**

- **시험 결과 제출 및 기록**: 실시간 답안 저장, 응시 기록 분석, 시험별 성적 추적
- **정답/오답 상태 추적**: 문제별 정답률 분석, 취약 문제 식별, 반복 실수 패턴 감지, 맞춤형 학습 추천
- **학습 데이터 분석**: 주제별 이해도 그래프, 목표 달성률 시각화, 학습 캘린더

### **2.1.9 크로스 플랫폼 지원**

- **iOS/Android 호환성**: 플랫폼별 네이티브 컴포넌트 분기 처리
- **안전 영역 처리**: 노치, 홈 인디케이터, 상태 바 등 다양한 디바이스 특성 대응, 동적 패딩 적용
- **반응형 스타일링**: 밀도 독립적 픽셀 사용, 디바이스 화면 비율 고려, 확장 가능한 컴포넌트 설계

### **2.1.10 기타 유틸리티**

- **색상 테마 관리**: 계층적 색상 시스템, 접근성 고려 색상 대비, 테마별 색상 팔레트 정의
- **환경 변수 관리**: API 엔드포인트 관리, 보안 정보 격리

### 2.2 백엔드

### 2.2.1 Spring Boot 백엔드 (be 폴더)

- 사용자 인증 및 권한 관리: Google OAuth 통합 및 JWT 기반 인증
- 문제 풀이 기능 구현 : 문제 조회, 풀이, 정오 체크 구현
- 마스터-슬레이브 데이터베이스 설계: 읽기/쓰기 작업 분리를 통한 성능 최적화
- Query 작성 : QueryDSL을 통한 쿼리 최적화 진행
- Redis 캐싱 구현: 자주 접근하는 데이터의 빠른 응답 보장
- 문제 정답 확인 및 사용자 진행 상황 관리 API 구현
- Docker 기반 배포 설정: 서버환경 세팅

### 2.2.2 FastAPI 백엔드 (gpt_be 폴더)

- Perplexity API 연동: 고급 자연어 처리를 통한 문제 해설 제공
- MySQL 데이터베이스 연동: 문제 데이터 저장

### 2.2.3 데이터 처리 (Data 폴더)

- 자격증 시험 문제 데이터 수집 및 정제
- 데이터베이스 스키마 설계 및 초기 데이터 마이그레이션
- 문제 분류 및 태깅: 주제별 문제 분류

### 2.2.4 인프라 구성 (docker-compose.yml)

- Docker 컨테이너화: 모든 서비스의 컨테이너 구성 관리
- MySQL 마스터-슬레이브 복제 설정: 데이터 일관성 및 고가용성 보장
- Redis 캐시 및 토큰 저장소 구성: 성능 최적화 및 토큰 관리
- Nginx 리버스 프록시 설정: API 게이트웨이 역할
- 헬스체크 및 의존성 관리: 서비스 간 의존성 및 상태 모니터링
- 프로젝트 네트워크 및 프로젝트 접근 관리

## 3. 구현된 프로젝트 기능

### 3.1 사용자 인증 및 회원가입

- Google OAuth 2.0 기반 소셜 로그인
- JWT 토큰 기반 인증 및 권한 관리
- Redis를 활용한 토큰 관리 및 세션 처리

### 3.2 시험 선택 및 문제 풀이

- 다양한 자격증 시험 목록 제공 및 선택 기능
- 객관식 및 주관식 문제 풀이 인터페이스
- 실시간 정답 확인 및 피드백 제공
- 문제별 자세한 해설 및 참고자료 제공

### 3.3 오답노트 관리

- 틀린 문제 자동 저장 및 분류
- 오답 문제 복습 기능 및 재테스트
- 사용자 노트 추가 기능: 개인 메모 및 학습 포인트 기록

### 3.4 기술적 특징

- 마스터-슬레이브 데이터베이스 구성: 읽기/쓰기 분리를 통한 성능 최적화
- Redis 캐싱: 자주 접근하는 데이터의 빠른 응답 보장
- 마이크로서비스 아키텍처: Spring Boot와 FastAPI의 분리된 역할
- Docker 기반 컨테이너화: 일관된 개발 및 배포 환경
- Nginx 리버스 프록시: 효율적인 트래픽 관리 및 보안 강화
