package com.example.be.config.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;

@Slf4j
public class RequestLogging implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        log.info("[REQUEST] {} {} (IP: {})", 
            request.getMethod(), 
            request.getRequestURI(), 
            request.getRemoteAddr());
        request.setAttribute("startTime", System.currentTimeMillis());
        
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
//        log.info("[RESPONSE] Status: {} ({}ms)",
//            response.getStatus(),
//            System.currentTimeMillis() - request.getAttribute("startTime"));
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 예외 발생 시
        if (ex != null) {
            log.error("[ERROR] Request processing failed: {}", ex.getMessage(), ex);
        }
    }
}