package com.example.be.common.domain.utils.handler;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.user.service.UserServiceImpl;
import com.example.be.common.domain.utils.jwt.JwtUtil;
import com.example.be.common.domain.utils.oauth2.KakaoUserInfo;
import com.example.be.common.domain.utils.oauth2.OAuth2UserInfo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserServiceImpl userService;

    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        OAuth2UserInfo oAuth2UserInfo = null;
        
        Map<String, Object> attributes = oAuth2User.getAttributes();
        if (attributes.containsKey("kakao_account")) {
            oAuth2UserInfo = new KakaoUserInfo(attributes);
        } else {
            throw new IllegalArgumentException("지원하지 않는 소셜 로그인입니다.");
        }
        
        String oauth2Id = getOauth2Id(oAuth2UserInfo);
        User user = userService.existByOauth2Id(oauth2Id) ? 
            userService.findByOauth2Id(oauth2Id) : 
            userService.signupByOAuth(oAuth2UserInfo);

        String token = jwtUtil.createToken(user.getUsername(), String.valueOf(user.getRole()));
        
        // 프론트엔드로 리다이렉트
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000")
            .queryParam("token", token)
            .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
    private static String getOauth2Id(OAuth2UserInfo oAuth2UserInfo) {
        return oAuth2UserInfo.getProvider() + "_" + oAuth2UserInfo.getProviderId();
    }
}

