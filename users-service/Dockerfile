# 빌드 스테이지
FROM gradle:8.12.1-jdk17 AS build
WORKDIR /app
COPY . .
RUN mkdir -p build/generated-snippets && gradle build -x test --no-daemon

# 실행 스테이지
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY docker-entrypoint.sh docker-entrypoint.sh

# 실행 권한 부여 및 필요한 패키지 설치
RUN chmod +x docker-entrypoint.sh && \
    apt-get update && apt-get install -y netcat-openbsd curl && rm -rf /var/lib/apt/lists/*

EXPOSE 8441
# EXPOSE 8080
COPY src/main/resources/keystore.p12 keystore.p12

ENTRYPOINT ["./docker-entrypoint.sh"]
