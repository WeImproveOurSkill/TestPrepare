package com.example.be.common.domain.utils.oauth2;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.Map;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleUserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes;

    @Override
    public String getProviderId() {
        return (String) attributes.get("sub");
    }

    @Override
    public String getProvider() {
        return "google";
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    public String getImageUrl() {
        return (String) attributes.get("picture");
    }
    
    // 추가 정보가 필요한 경우
    public String getGivenName() {
        return (String) attributes.get("given_name");
    }
    
    public String getFamilyName() {
        return (String) attributes.get("family_name");
    }
    
    public Boolean isEmailVerified() {
        return (Boolean) attributes.get("email_verified");
    }
}



