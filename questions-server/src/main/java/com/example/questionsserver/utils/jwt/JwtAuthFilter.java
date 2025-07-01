package com.example.questionsserver.utils.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = jwtUtils.resolveAccessToken(request);

        if (StringUtils.hasText(accessToken) && jwtUtils.isTokenValid(accessToken)) {
            Claims claims = jwtUtils.getUserInfoFromToken(accessToken);
            String username = claims.getSubject();
            String role = claims.get("auth").toString();

            // 직접 Authentication 생성 (UserDetailsService 없이)
            setAuthentication(username, role);
        }

        filterChain.doFilter(request, response); // 필수!


    }

    public void setAuthentication(String username, String role) {
        // 커스텀 UserPrincipal 생성
        UserPrincipal userPrincipal = new UserPrincipal(username,role);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userPrincipal, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));

        SecurityContextHolder.getContext().setAuthentication(authentication);

    }

}
