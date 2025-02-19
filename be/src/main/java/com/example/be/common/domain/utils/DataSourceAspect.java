package com.example.be.common.domain.utils;

import com.example.be.config.ReplicationRoutingDataSource;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Aspect
@Component
public class DataSourceAspect {

    @Around("@annotation(org.springframework.transaction.annotation.Transactional)")
    public Object setDataSource(ProceedingJoinPoint joinPoint) throws Throwable {
        Transactional transactional = ((MethodSignature) joinPoint.getSignature())
                .getMethod()
                .getAnnotation(Transactional.class);

        if (transactional.readOnly()) {
            ReplicationRoutingDataSource.setCurrentDataSource("slave"); // 읽기 전용 -> Slave로
        } else {
            ReplicationRoutingDataSource.setCurrentDataSource("master"); // 쓰기 -> Master로
        }

        try {
            return joinPoint.proceed();
        } finally {
            ReplicationRoutingDataSource.setCurrentDataSource("master"); // 기본값 복원
        }
    }
}
