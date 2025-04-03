package com.example.be.common.domain.utils.jwt;

import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;


@Component
@Slf4j
public class JwtUtil {

    private final SecretKey secretKey;
    //Auth
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String AUTHORIZATION_KEY = "auth";
    private static final long ACCESS_TOKEN_TIME = 7 * 60 * 60 * 1000L;

    //Refresh
    public static final String REFRESH_HEADER = "Refresh";
    public static final String REFRESH_KEY = "refresh";
    private static final long REFRESH_TOKEN_TIME = 48 * 7 * 60 * 60 * 1000L;

    private static final String BEARER_PREFIX = "Bearer ";

    private final RedisTemplate<String, Object> tokenRedisTemplate;


    public JwtUtil(@Value("${jwt.secret-key}") String base64Key, @Qualifier("redisTokenTemplate") RedisTemplate<String, Object> tokenRedisTemplate) {
        this.tokenRedisTemplate = tokenRedisTemplate;
        byte[] keyBytes = Base64.getDecoder().decode(base64Key);
        this.secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
    }


    public String createAccessToken(String username, String role) {

        Claims claims = Jwts.claims();
        claims.put(AUTHORIZATION_KEY, role);
        claims.put("type", "access");

        return BEARER_PREFIX + Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_TIME))
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(String username, String role) {

        Claims claims = Jwts.claims();
        claims.put(REFRESH_KEY, role);
        claims.put("type", "refresh");

        String refreshToken = BEARER_PREFIX + Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_TIME))
                .signWith(secretKey)
                .compact();

        tokenRedisTemplate.opsForValue().set(
                username,
                refreshToken,
                REFRESH_TOKEN_TIME,
                TimeUnit.MILLISECONDS
        );

        return refreshToken;
    }

    public String resolveAccessToken(HttpServletRequest request) {
        String token = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(token) && token.startsWith(BEARER_PREFIX)) {
            return token.substring(BEARER_PREFIX.length());
        }
        return "";
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT signature, 유효하지 않는 JWT 서명 입니다.");
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT token, 만료된 JWT token 입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT token, 지원되지 않는 JWT 토큰 입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT claims is empty, 잘못된 JWT 토큰 입니다.");
        }
        return false;
    }

    public boolean isRefreshTokenValid(String token, String username) {
        try {
            // 1. Redis에서 저장된 토큰 확인
            String savedToken = getRefreshToken(username);
            if (savedToken == null || !savedToken.equals(token)) {
                log.warn("Refresh token not found in Redis or doesn't match");
                return false;
            }

            // 2. 토큰 자체 검증
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // 3. 토큰 유형 검증
            String tokenType = claims.get("type", String.class);
            if (!"refresh".equals(tokenType)) {
                log.warn("This is not a refresh token");
                return false;
            }

            return true;
        } catch (Exception e) {
            log.info("Invalid refresh token: {}", e.getMessage());
            return false;
        }
    }

    public String getRefreshToken(String username) {
        Object token = tokenRedisTemplate.opsForValue().get(username);
        return token != null ? token.toString() : null;
    }

    public boolean deleteRefreshToken(String username) {
    try {
        Boolean isDeleted = tokenRedisTemplate.delete(username);
        if (Boolean.TRUE.equals(isDeleted)) {
            log.info("리프레시 토큰 삭제 성공: {}", username);
            return true;
        } else {
            log.warn("리프레시 토큰 삭제 실패: 키가 존재하지 않음 - {}", username);
            return false;
        }
    } catch (Exception e) {
        log.error("리프레시 토큰 삭제 중 오류 발생: {}", e.getMessage());
        return false;
    }
}

    public Claims getUserInfoFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
    }
}