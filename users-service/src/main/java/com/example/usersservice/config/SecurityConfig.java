package com.example.usersservice.config;

import com.example.usersservice.utils.jwt.JwtAuthFilter;
import com.example.usersservice.utils.log.TraceIdFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final TraceIdFilter traceIdFilter;


    private final String[] permitAllArray = {
            "/oauth2/authorization/**",
            "/login/oauth2/code/**",
            "/oauth/callback/**"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        return request -> {
//            CorsConfiguration corsConfiguration = new CorsConfiguration();
//            corsConfiguration.setAllowedHeaders(Collections.singletonList("*"));
//            corsConfiguration.setAllowedOrigins(Collections.singletonList("*"));
//            corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//            corsConfiguration.setAllowCredentials(true);
//            return corsConfiguration;
//        };
//    }

    @Bean
    public SecurityFilterChain filterChain

            (HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(sessionManagement ->
                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authorizeHttpRequests(auth ->
                auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(permitAllArray).permitAll()
                        .anyRequest().authenticated());

        http.addFilterBefore(traceIdFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(jwtAuthFilter, TraceIdFilter.class);
        return http.build();
    }

}
