package com.example.be.common.domain.utils.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        String accessToken = jwtUtil.resolveAccessToken(request);
        if (!Objects.equals(accessToken, "") && jwtUtil.isTokenValid(accessToken)) {
            Claims info = jwtUtil.getUserInfoFromToken(accessToken);
            String name = info.getSubject();
            
            if (name == null || name.isEmpty()) {
                log.error("JWT 토큰에서 사용자 이름(subject)을 찾을 수 없습니다. 토큰: {}", accessToken);
            } else {
                String role = info.get("auth") != null ? info.get("auth").toString() : "USER";
                log.debug("JWT 토큰 인증 성공: 사용자={}, 역할={}", name, role);
                setAuthentication(name, role);
            }
        }
        // 필터 체인의 다음 필터로 넘어감
        filterChain.doFilter(request, response);
    }

    public void setAuthentication(String username, String role) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = this.createAuthentication(username);
//    if (role.equals("Admin")) {
//      authentication = this.createAdminAuthentication(username);
//    } else {
//      authentication = this.createAuthentication(username);
//    }
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }

    public Authentication createAuthentication(String username) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());
    }
}

