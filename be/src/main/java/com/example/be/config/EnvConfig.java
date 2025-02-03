package com.example.be.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    static {
        Dotenv dotenv = Dotenv.configure()
                .directory("../be") // `.env` 파일이 있는 디렉토리 설정
                .ignoreIfMissing()
                .load();

        // 환경 변수를 JVM 옵션으로 설정
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
