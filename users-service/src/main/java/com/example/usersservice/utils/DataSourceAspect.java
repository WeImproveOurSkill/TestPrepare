package com.example.usersservice.utils;


import com.example.usersservice.config.ReplicationRoutingDataSource;
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
    public Object setDataSource(ProceedingJoinPoint pjp) throws Throwable {
        Transactional transactional = ((MethodSignature) pjp.getSignature())
                .getMethod()
                .getAnnotation(Transactional.class);
        if (transactional.readOnly()) {
            ReplicationRoutingDataSource.setCurrentDataSource("slave");
        }else{
            ReplicationRoutingDataSource.setCurrentDataSource("master");
        }

        try{
            return pjp.proceed();
        }finally {
            ReplicationRoutingDataSource.setCurrentDataSource("master");
        }
    }
}
