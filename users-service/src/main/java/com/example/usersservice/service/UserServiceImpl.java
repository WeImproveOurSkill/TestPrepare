package com.example.usersservice.service;


import com.example.usersservice.entity.User;
import com.example.usersservice.repository.UserRepository;
import com.example.usersservice.utils.jwt.JwtUtils;
import com.example.usersservice.utils.oAuth2.GoogleUserInfo;
import com.example.usersservice.utils.oAuth2.KakaoUserInfo;
import com.example.usersservice.utils.oAuth2.OAuth2UserInfo;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.util.Map;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtil;
    private final RestTemplate restTemplate;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> tokenRedisTemplate;

    public UserServiceImpl(UserRepository userRepository, 
                          JwtUtils jwtUtil, 
                          RestTemplate restTemplate, 
                          PasswordEncoder passwordEncoder,
                          @Qualifier("redisTokenTemplate") RedisTemplate<String, Object> tokenRedisTemplate) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
        this.passwordEncoder = passwordEncoder;
        this.tokenRedisTemplate = tokenRedisTemplate;
    }


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
                .password(passwordEncoder.encode(oAuth2UserInfo.getName()))
                .build();

        userRepository.save(user);
        return user;
    }

    private String getOauth2Id(OAuth2UserInfo oAuth2UserInfo) {
        return oAuth2UserInfo.getProvider() + "_" + oAuth2UserInfo.getProviderId();
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
            HttpEntity<String> entity = getHttpEntity(object);
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
            String userAccessToken;
            try {
                userAccessToken = jwtUtil.createAccessToken(user.getUsername(), String.valueOf(user.getRole()));
                jwtUtil.createRefreshToken(user.getUsername(), String.valueOf(user.getRole()));
            } catch (Exception e) {
                throw new RuntimeException("JWT 토큰 생성 중 오류 발생: " + e.getMessage(), e);
            }
            // 응답 객체 생성 (User 객체 직렬화)
            return getJsonObject(userAccessToken, user);

        } catch (Exception e) {
            // 최상위 예외 처리
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", "OAuth 처리 중 오류가 발생했습니다.");
            errorResponse.put("message", e.getMessage());
            throw new RuntimeException("OAuth 처리 중 오류: " + e.getMessage(), e);
        }
    }

    private static JSONObject getJsonObject(String userAccessToken,  User user) {
        JSONObject response = new JSONObject();
        response.put("token", userAccessToken);

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
    public JSONObject googleCallback(JSONObject object) {
        try {
            HttpEntity<String> entity = getHttpEntity(object);
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

            String userAccessToken;
            try {
                userAccessToken = jwtUtil.createAccessToken(user.getUsername(), String.valueOf(user.getRole()));
                jwtUtil.createRefreshToken(user.getUsername(), String.valueOf(user.getRole()));
            } catch (Exception e) {
                throw new RuntimeException("JWT 토큰 생성 중 오류 발생: " + e.getMessage(), e);
            }
            return getJsonObject(userAccessToken,  user);

        } catch (Exception e) {
            // 최상위 예외 처리
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", "OAuth 처리 중 오류가 발생했습니다.");
            errorResponse.put("message", e.getMessage());
            throw new RuntimeException("OAuth 처리 중 오류: " + e.getMessage(), e);
        }
    }

    private static HttpEntity<String> getHttpEntity(JSONObject object) {
        String accessToken = getString(object);

        if (accessToken == null || accessToken.trim().isEmpty()) {
            throw new IllegalArgumentException("액세스 토큰이 유효하지 않습니다.");
        }

        // 구글 API로 사용자 정보 조회
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        Map<String, Object> attributes;
        return entity;
    }

    private static String getString(JSONObject object) {
        // accessToken 검증 및 추출
        if (!object.containsKey("accessToken")) {
            throw new IllegalArgumentException("액세스 토큰이 존재하지 않습니다.");
        }

        Object accessTokenObj = object.get("accessToken");
        String accessToken = accessTokenObj instanceof String ?
                (String) accessTokenObj :
                String.valueOf(accessTokenObj);
        return accessToken;
    }

    @Override
    public JSONObject refreshToken(String username) {
        // 1. Redis에서 리프레시 토큰 조회 및 비교
        String storedRefreshToken = jwtUtil.getRefreshToken(username);
//        if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
//            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
//        }

        // 2. 리프레시 토큰 유효성 검증
        if (!jwtUtil.isRefreshTokenValid(username, storedRefreshToken)) {
            throw new IllegalArgumentException("만료되거나 유효하지 않은 리프레시 토큰입니다.");
        }

        // 3. 사용자 정보 조회
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 4. 새로운 액세스 토큰 생성
        String newAccessToken = jwtUtil.createAccessToken(username, String.valueOf(user.getRole()));

        // 5. 응답 생성
        JSONObject response = new JSONObject();
        response.put("token", newAccessToken);
        response.put("message", "토큰이 성공적으로 갱신되었습니다.");

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
