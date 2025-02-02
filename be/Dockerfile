FROM amazoncorretto:17
LABEL authors="gimminsoo"

ARG JAR_FILE=build/libs/*.jar

RUN find . -type f -name "*.jar" || echo "No JAR files found"

COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
