package com.example.be.common.domain.user.service;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.user.repository.UserRepository;
import com.example.be.common.domain.utils.jwt.JwtUtil;
import com.example.be.common.domain.utils.oauth2.KakaoUserInfo;
import com.example.be.common.domain.utils.oauth2.OAuth2UserInfo;
import lombok.RequiredArgsConstructor;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import net.minidev.json.parser.ParseException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.beans.Transient;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import static com.example.be.common.domain.utils.handler.OAuth2SuccessHandler.getOauth2Id;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    @Override
    @Transactional
    public User signupByOAuth(OAuth2UserInfo oAuth2UserInfo) {
        String email =  oAuth2UserInfo.getEmail().isEmpty()?oAuth2UserInfo.getEmail() :"not have email";
        String oauth2Id = getOauth2Id(oAuth2UserInfo);
        User user = User.builder()
                .username(oAuth2UserInfo.getName())
                .nickname(oAuth2UserInfo.getName() + oAuth2UserInfo.getProvider())
                .email(email)
                .oauth2Id(oauth2Id)
                .provider(oAuth2UserInfo.getProvider())
                .providerId(oAuth2UserInfo.getProviderId())
                .role(User.Role.COMMON)
                .password(oAuth2UserInfo.getName())
                .build();

        userRepository.save(user);
        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public User findByOauth2Id(String oauth2Id) {
        return userRepository.findByOauth2Id(oauth2Id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existByOauth2Id(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public JSONObject kakaoCallback(JSONObject object) throws ParseException {
        // accessToken 객체에서 토큰 값 추출
        Object accessTokenObj = object.get("accessToken");
        String accessToken = accessTokenObj instanceof String ? 
            (String) accessTokenObj : 
            String.valueOf(accessTokenObj);

        // 디버깅을 위한 로그 추가
        System.out.println("Processed access token: " + accessToken);
        
        // 카카오 API로 사용자 정보 조회
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        // API 호출 전 헤더 확인
        System.out.println("Request headers: " + headers);
        
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
            "https://kapi.kakao.com/v2/user/me",
            HttpMethod.GET,
            entity,
            Map.class
        );
        
        Map<String, Object> attributes = userInfoResponse.getBody();
        KakaoUserInfo kakaoUserInfo = new KakaoUserInfo(attributes);
        
        // 사용자 정보 저장 또는 조회
        String oauth2Id = kakaoUserInfo.getProvider() + "_" + kakaoUserInfo.getProviderId();
        User user = userRepository.findByOauth2Id(oauth2Id)
            .orElseGet(() -> signupByOAuth(kakaoUserInfo));
        
        // JWT 토큰 생성
        String token = jwtUtil.createToken(user.getUsername(), String.valueOf(user.getRole()));
        
        JSONObject response = new JSONObject();
        response.put("token", token);
        response.put("user", user);
        
        return response;
    }
}
