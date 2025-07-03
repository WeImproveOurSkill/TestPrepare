package com.example.questionsserver.utils.log;


import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(0)
public class TraceIdFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        try{
            HttpServletRequest request = (HttpServletRequest) servletRequest;
            String traceId = request.getHeader("X-Trace-Id");

            if (traceId == null || traceId.isEmpty()) {
                traceId = UUID.randomUUID().toString();
            }
            MDC.put("traceId", traceId);
            filterChain.doFilter(servletRequest,servletResponse);
        }finally {
            MDC.remove("traceId");
        }
    }
}