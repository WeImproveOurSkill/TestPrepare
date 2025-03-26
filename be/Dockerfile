# 빌드 스테이지
FROM gradle:8.12.1-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test --no-daemon

# 실행 스테이지
FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY docker-entrypoint.sh docker-entrypoint.sh

# 실행 권한 부여 및 쉘 설치 (Alpine Linux는 기본적으로 netcat이 없음)
RUN chmod +x docker-entrypoint.sh && \
    apk add --no-cache netcat-openbsd

EXPOSE 8080
ENTRYPOINT ["./docker-entrypoint.sh"]
