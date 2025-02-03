package com.example.be.common.domain.utils.oauth2;

import com.nimbusds.openid.connect.sdk.claims.UserInfo;

import java.util.Map;

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
        return properties != null ? (String) properties.get("nickname") : null;
    }

    @Override
    public String getEmail() {
        return "Not email";
    }

    public String getImageUrl() {
        return properties != null ? (String) properties.get("profile_image") : null;
    }

}
