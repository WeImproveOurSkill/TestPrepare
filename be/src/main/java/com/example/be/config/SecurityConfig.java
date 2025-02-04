package com.example.be.config;

import com.example.be.common.domain.utils.handler.OAuth2SuccessHandler;
import com.example.be.common.domain.utils.jwt.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final String[] permitOrigin = {
            "http://localhost:8080",
            "http://localhost:3000",
            "https://localhost:3000",
            "https://kauth.kakao.com/**"
    };

    private final String[] permitAllArray = {
            "/oauth2/authorization/**",
            "/login/oauth2/code/**",
            "/"
    };

    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedHeaders(Collections.singletonList("*"));
            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedOrigins(List.of(permitOrigin));
            config.setAllowCredentials(true);
            config.setExposedHeaders(Arrays.asList("Authorization", "Refresh"));


            return config;
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrfConf ->
                csrfConf.disable());
        http.cors(corsConf ->
                corsConf.configurationSource(corsConfigurationSource()));
        http.sessionManagement(sessionManagementConf ->
                sessionManagementConf.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authorizeHttpRequests(auth ->
                auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(permitAllArray).permitAll()
                        .anyRequest().authenticated());

        http.oauth2Login(loginConf ->
                loginConf.successHandler(oAuth2SuccessHandler));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
