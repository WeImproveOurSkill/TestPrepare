package com.example.be;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


import java.util.Base64;

@SpringBootApplication

//@EnableCaching
@EnableJpaAuditing
public class BeApplication {

    public static void main(String[] args) {
//        byte[] keyBytes = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
//        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
//        System.out.println("SECRET_KEY=" + base64Key);

        SpringApplication.run(BeApplication.class, args);
    }

}
