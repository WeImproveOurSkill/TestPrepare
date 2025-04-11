package com.example.be.common.domain.annotation;

import com.example.be.common.domain.user.entity.User;
import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithMockCustomUserSecurityContextFactory.class)
public @interface WithCustomMockUser {
    String username() default "username";
    String password() default "password";
    User.Role role() default User.Role.COMMON;
    String nickname() default "nickname";

}
