package com.example.be.common.domain.user.service;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.user.repository.UserRepository;
import com.example.be.common.domain.utils.jwt.JwtUtil;
import com.example.be.common.domain.utils.oauth2.GoogleUserInfo;
import com.example.be.common.domain.utils.oauth2.KakaoUserInfo;
import com.example.be.common.domain.utils.oauth2.OAuth2UserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.ParseException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static com.example.be.common.domain.utils.handler.OAuth2SuccessHandler.getOauth2Id;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    @Override
    @Transactional
    public User signupByOAuth(OAuth2UserInfo oAuth2UserInfo) {
        String email = oAuth2UserInfo.getEmail().isEmpty() ? oAuth2UserInfo.getEmail() : "not have email";
        String oauth2Id = getOauth2Id(oAuth2UserInfo);
        User user = User.builder()
                .username(oAuth2UserInfo.getName() + "_" + oAuth2UserInfo.getProvider())
                .nickname(oAuth2UserInfo.getName() + "_" + oAuth2UserInfo.getProvider())
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
        try {
            // accessToken 검증 및 추출
            if (!object.containsKey("accessToken")) {
                throw new IllegalArgumentException("액세스 토큰이 존재하지 않습니다.");
            }

            Object accessTokenObj = object.get("accessToken");
            String accessToken = accessTokenObj instanceof String ? 
                (String) accessTokenObj : 
                String.valueOf(accessTokenObj);

            if (accessToken == null || accessToken.trim().isEmpty()) {
                throw new IllegalArgumentException("액세스 토큰이 유효하지 않습니다.");
            }

            // 디버깅을 위한 로그 추가
            System.out.println("Processed access token: " + accessToken);
            
            // 카카오 API로 사용자 정보 조회
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // API 호출 전 헤더 확인
            System.out.println("Request headers: " + headers);
            
            Map<String, Object> attributes;
            try {
                ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET,
                    entity,
                    Map.class
                );
                attributes = userInfoResponse.getBody();
                
                if (attributes == null) {
                    throw new RuntimeException("카카오 API로부터 사용자 정보를 받아오지 못했습니다.");
                }
            } catch (Exception e) {
                throw new RuntimeException("카카오 API 호출 중 오류 발생: " + e.getMessage(), e);
            }
            
            // 카카오 사용자 정보 변환
            KakaoUserInfo kakaoUserInfo = new KakaoUserInfo(attributes);
            
            // 사용자 정보 저장 또는 조회
            String oauth2Id = kakaoUserInfo.getProvider() + "_" + kakaoUserInfo.getProviderId();
            User user;
            try {
                user = userRepository.findByOauth2Id(oauth2Id)
                    .orElseGet(() -> signupByOAuth(kakaoUserInfo));
            } catch (Exception e) {
                throw new RuntimeException("사용자 정보 처리 중 오류 발생: " + e.getMessage(), e);
            }
            
            // JWT 토큰 생성
            String userAccseeToken;
            String userRefreshToken;
            try {
                userAccseeToken = jwtUtil.createAccessToken(user.getUsername(), String.valueOf(user.getRole()));
                userRefreshToken = jwtUtil.createRefreshToken(user.getUsername(), String.valueOf(user.getRole()));
            } catch (Exception e) {
                throw new RuntimeException("JWT 토큰 생성 중 오류 발생: " + e.getMessage(), e);
            }
            // 응답 객체 생성 (User 객체 직렬화)
            JSONObject response = new JSONObject();
            response.put("token", userAccseeToken);
            response.put("refresh", userRefreshToken);

            // User 객체 필요한 정보만 선택적으로 포함
            JSONObject userJson = new JSONObject();
            // userJson.put("id", user.getId());
            userJson.put("username", user.getUsername());
            // userJson.put("email", user.getEmail());
            userJson.put("nickname", user.getNickname());
            // userJson.put("role", user.getRole().toString());
            userJson.put("provider", user.getProvider());
            
            response.put("user", userJson);
            
            return response;
            
        } catch (Exception e) {
            // 최상위 예외 처리
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", "OAuth 처리 중 오류가 발생했습니다.");
            errorResponse.put("message", e.getMessage());
            throw new RuntimeException("OAuth 처리 중 오류: " + e.getMessage(), e);
        }
    }

    @Override
    public JSONObject googleCallback(JSONObject object) {
        try {
            // accessToken 검증 및 추출
            if (!object.containsKey("accessToken")) {
                throw new IllegalArgumentException("액세스 토큰이 존재하지 않습니다.");
            }

            Object accessTokenObj = object.get("accessToken");
            String accessToken = accessTokenObj instanceof String ?
                    (String) accessTokenObj :
                    String.valueOf(accessTokenObj);

            if (accessToken == null || accessToken.trim().isEmpty()) {
                throw new IllegalArgumentException("액세스 토큰이 유효하지 않습니다.");
            }

            // 디버깅을 위한 로그 추가
            System.out.println("Processed access token: " + accessToken);

            // 구글 API로 사용자 정보 조회
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // API 호출 전 헤더 확인
            System.out.println("Request headers: " + headers);

            Map<String, Object> attributes;
            try {
                ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                        "https://www.googleapis.com/oauth2/v3/userinfo",
                        HttpMethod.GET,
                        entity,
                        Map.class
                );
                attributes = userInfoResponse.getBody();

                if (attributes == null) {
                    throw new RuntimeException("구글 API로부터 사용자 정보를 받아오지 못했습니다.");
                }
            } catch (Exception e) {
                throw new RuntimeException("구글 API 호출 중 오류 발생: " + e.getMessage(), e);
            }

            // 구글 사용자 정보 변환
            GoogleUserInfo googleUserInfo = new GoogleUserInfo(attributes);

            // 사용자 정보 저장 또는 조회
            String oauth2Id = googleUserInfo.getProvider() + "_" + googleUserInfo.getProviderId();
            User user;
            try {
                user = userRepository.findByOauth2Id(oauth2Id)
                        .orElseGet(() -> signupByOAuth(googleUserInfo));
            } catch (Exception e) {
                throw new RuntimeException("사용자 정보 처리 중 오류 발생: " + e.getMessage(), e);
            }

            // JWT 토큰 생성
            String token;
            try {
                token = jwtUtil.createAccessToken(user.getUsername(), String.valueOf(user.getRole()));
            } catch (Exception e) {
                throw new RuntimeException("JWT 토큰 생성 중 오류 발생: " + e.getMessage(), e);
            }
            System.out.println(token);
            // 응답 객체 생성 (User 객체 직렬화)
            JSONObject response = new JSONObject();
            response.put("token", token);

            // User 객체 필요한 정보만 선택적으로 포함
            JSONObject userJson = new JSONObject();
            // userJson.put("id", user.getId());
            userJson.put("username", user.getUsername());
            // userJson.put("email", user.getEmail());
            userJson.put("nickname", user.getNickname());
            // userJson.put("role", user.getRole().toString());
            userJson.put("provider", user.getProvider());

            response.put("user", userJson);

            return response;

        } catch (Exception e) {
            // 최상위 예외 처리
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", "OAuth 처리 중 오류가 발생했습니다.");
            errorResponse.put("message", e.getMessage());
            throw new RuntimeException("OAuth 처리 중 오류: " + e.getMessage(), e);
        }
    }

    @Override
    public JSONObject refreshAccessToken(String username, String refreshToken) {
        boolean refreshTokenValid = jwtUtil.isRefreshTokenValid(username, refreshToken);
        if (!refreshTokenValid) {
            throw new IllegalArgumentException("해당 사용자는 재로그인을 진행해야합니다.");
        }
        User user = findByUsername(username);

        String token;
        try {
            token = jwtUtil.createAccessToken(user.getUsername(), String.valueOf(user.getRole()));
        } catch (Exception e) {
            throw new RuntimeException("JWT 토큰 생성 중 오류 발생: " + e.getMessage(), e);
        }
        System.out.println(token);
        // 응답 객체 생성 (User 객체 직렬화)
        JSONObject response = new JSONObject();
        response.put("token", token);

        // User 객체 필요한 정보만 선택적으로 포함
        JSONObject userJson = new JSONObject();
        // userJson.put("id", user.getId());
        userJson.put("username", user.getUsername());
        // userJson.put("email", user.getEmail());
        userJson.put("nickname", user.getNickname());
        // userJson.put("role", user.getRole().toString());
        userJson.put("provider", user.getProvider());

        response.put("user", userJson);

        return response;
    }

    @Override
    public boolean logout(User user) {
        return jwtUtil.deleteRefreshToken(user.getUsername());
    }

    @Override
    @Transactional
    public boolean deleteAccount(User user) {
        try {
            // 이미 인증을 통해 확인된 사용자이므로 추가 조회 없이 바로 삭제
            userRepository.delete(user);
            return true;
        } catch (Exception e) {
            log.error("회원탈퇴 처리 중 예외 발생: {}", e.getMessage(), e);
            return false;
        }
    }
}
