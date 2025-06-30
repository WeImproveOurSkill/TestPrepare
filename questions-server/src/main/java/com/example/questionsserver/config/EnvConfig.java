package com.example.questionsserver.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {

    static {
        Dotenv dotenv = Dotenv.configure()
                .directory("../question-server")
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(dotenvEntry -> System.setProperty(dotenvEntry.getKey(), dotenvEntry.getValue()));
    }
}
