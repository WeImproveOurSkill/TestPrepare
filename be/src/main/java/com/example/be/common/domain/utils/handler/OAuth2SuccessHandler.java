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
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        OAuth2UserInfo oAuth2UserInfo = null;
        String registrationId = oAuth2User.getAttribute("registration_id");

        if (registrationId.equals("kakao")) {
            oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes());
        }else{
            System.out.println("로그인 실패");
        }
        String oauth2Id = getOauth2Id(oAuth2UserInfo);
//        Optional<User> findUser = userService.findByOauth2Id(oauth2Id);
        User user = userService.existByOauth2Id(oauth2Id) ? userService.findByOauth2Id(oauth2Id) :userService.signupByOAuth(oAuth2UserInfo);

        String token = jwtUtil.createToken(user.getUsername(), String.valueOf(user.getRole()));
        Cookie cookie = new Cookie("token", token);
        cookie.setPath("/");
        response.addCookie(cookie);

        String targetUrl = "http://localhost:3000"; //redirect 시킬 react 경로
        String redirectUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
    private static String getOauth2Id(OAuth2UserInfo oAuth2UserInfo) {
        return oAuth2UserInfo.getProvider() + "_" + oAuth2UserInfo.getProviderId();
    }
}

