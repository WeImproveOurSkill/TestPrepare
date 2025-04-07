package com.example.be.common.domain.fixture;

import com.example.be.common.domain.utils.oauth2.GoogleUserInfo;
import com.example.be.common.domain.utils.oauth2.KakaoUserInfo;
import java.util.HashMap;
import java.util.Map;

public class UserFixture {
    
    public static GoogleUserInfo createGoogleUserInfo() {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("sub", "123456789");
        attributes.put("name", "Test User");
        attributes.put("email", "test@gmail.com");
        attributes.put("picture", "https://test-picture.com/image.jpg");
        attributes.put("given_name", "Test");
        attributes.put("family_name", "User");
        attributes.put("email_verified", true);
        
        return GoogleUserInfo.builder()
                .attributes(attributes)
                .build();
    }
    
    public static KakaoUserInfo createKakaoUserInfo() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("nickname", "카카오테스트유저");
        properties.put("profile_image", "https://test-kakao.com/image.jpg");
        
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("id", "987654321");
        attributes.put("properties", properties);
        
        return KakaoUserInfo.builder()
                .attributes(attributes)
                .properties(properties)
                .build();
    }
    
    public static GoogleUserInfo createInvalidGoogleUserInfo() {
        Map<String, Object> attributes = new HashMap<>();
        // 필수 필드 누락
        attributes.put("sub", "123456789");
        
        return GoogleUserInfo.builder()
                .attributes(attributes)
                .build();
    }
    
    public static KakaoUserInfo createInvalidKakaoUserInfo() {
        Map<String, Object> attributes = new HashMap<>();
        // properties 없이 생성
        attributes.put("id", "987654321");
        
        return KakaoUserInfo.builder()
                .attributes(attributes)
                .build();
    }
}
