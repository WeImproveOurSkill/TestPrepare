package com.example.usersservice.utils.jwt;

import com.example.usersservice.utils.userDetailsImpl.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
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
@Order(1)
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = jwtUtils.resolveAccessToken(request);
        if (!Objects.equals(accessToken,"") && jwtUtils.isTokenValid(accessToken)) {
            Claims userInfoFromToken = jwtUtils.getUserInfoFromToken(accessToken);
            String username = userInfoFromToken.getSubject();
            String role = userInfoFromToken.get("auth").toString();
            setAuthentication(username,role);
        }
        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove("userId");
        }
    }

    public void setAuthentication(String username,String role) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication;
        if(role.equals("Admin")){
            authentication = this.createAdminAuthentication(username,role);
        }else{
            authentication = this.createAuthentication(username,role);
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String usernameForMDC = userDetails.getUsername();
        MDC.put("userID", usernameForMDC);
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }

    public Authentication createAuthentication(String username, String role) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, role, userDetails.getAuthorities());
    }
    public Authentication createAdminAuthentication(String username, String role) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, role, userDetails.getAuthorities());
    }
}
