package com.example.be.config;

import com.example.be.config.interceptor.RequestLogging;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RequestLogging())
                .addPathPatterns("/**");  // 모든 요청에 대해 로깅
    }
}