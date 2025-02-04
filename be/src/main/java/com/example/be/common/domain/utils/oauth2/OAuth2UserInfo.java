package com.example.be.common.domain.utils.oauth2;


public interface OAuth2UserInfo {
    String getProviderId();

    String getProvider();

    String getName();
    String getEmail();
}
