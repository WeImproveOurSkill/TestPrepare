# 빌드 스테이지
FROM gradle:8.12.1-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test --no-daemon

# 실행 스테이지
FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

# 실행 권한 부여
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/app/docker-entrypoint.sh"]
