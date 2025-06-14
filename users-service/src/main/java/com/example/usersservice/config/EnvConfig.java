package com.example.usersservice.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    static{
        Dotenv load = Dotenv.configure()
                .directory("../user-service")
                .ignoreIfMissing()
                .load();
        load.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
