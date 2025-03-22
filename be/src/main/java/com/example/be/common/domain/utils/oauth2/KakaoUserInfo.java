package com.example.be.common.domain.utils.oauth2;

import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Bean;

import java.util.Map;
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoUserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes;
    private Map<String, Object> properties;
    private Map<String, Object> kakaoAccount;

    public KakaoUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
        this.properties = (Map<String, Object>) attributes.get("properties");
        this.kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
    }

    @Override
    public String getProviderId() {
        return String.valueOf(attributes.get("id"));
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getName() {
        return properties != null ? (String) properties.get("nickname") : "nickName"+String.valueOf(Math.round(Math.random()*100000));
    }

    @Override
    public String getEmail() {
        return properties != null ? (String) properties.get("nickname") : "Not email";
    }

    public String getImageUrl() {
        return properties != null ? (String) properties.get("profile_image") : null;
    }

}
