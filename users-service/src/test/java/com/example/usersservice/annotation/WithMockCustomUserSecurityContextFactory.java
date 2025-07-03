package com.example.usersservice.annotation;


import com.example.usersservice.entity.User;
import com.example.usersservice.utils.userDetailsImpl.UserDetailsImpl;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.util.List;

public class WithMockCustomUserSecurityContextFactory implements WithSecurityContextFactory<WithCustomMockUser> {
    @Override
    public SecurityContext createSecurityContext(WithCustomMockUser annotation) {
        final SecurityContext context = SecurityContextHolder.createEmptyContext();
        
        User user = User.builder()
                .username(annotation.username())
                .password(annotation.password())
                .role(annotation.role())
                .nickname(annotation.nickname())
                .build();
        
        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        
        final Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + annotation.role().name()))
        );
        
        context.setAuthentication(authentication);
        return context;
    }
}
