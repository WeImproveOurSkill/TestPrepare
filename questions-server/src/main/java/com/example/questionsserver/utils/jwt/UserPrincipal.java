package com.example.questionsserver.utils.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails; // UserDetails 임포트

import java.util.Collection;
import java.util.Collections;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails { // UserDetails 인터페이스 구현
    private String username;
    private String role;

    // UserDetails 인터페이스 메서드 구현 시작

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 토큰에서 추출한 role을 기반으로 권한을 반환합니다.
        // Spring Security는 "ROLE_" 접두사를 권장합니다.
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        // JWT 인증에서는 비밀번호를 사용하지 않으므로 null을 반환합니다.
        return null;
    }

    @Override
    public String getUsername() {
        // 사용자 이름을 반환합니다.
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        // 계정 만료 여부. JWT는 만료 시간을 자체적으로 가지므로,
        // 토큰이 유효하다면 계정은 만료되지 않은 것으로 간주합니다.
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // 계정 잠금 여부. JWT가 유효하다면 계정은 잠기지 않은 것으로 간주합니다.
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // 자격 증명(비밀번호) 만료 여부. JWT 인증에서는 비밀번호를 사용하지 않으므로 항상 true를 반환합니다.
        return true;
    }

    @Override
    public boolean isEnabled() {
        // 계정 활성화 여부. JWT가 유효하다면 계정은 활성화된 것으로 간주합니다.
        return true;
    }

    // UserDetails 인터페이스 메서드 구현 끝

    public static UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // principal이 UserPrincipal 타입인지 확인하고 캐스팅합니다.
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) auth.getPrincipal();
        }
        return null;
    }
}