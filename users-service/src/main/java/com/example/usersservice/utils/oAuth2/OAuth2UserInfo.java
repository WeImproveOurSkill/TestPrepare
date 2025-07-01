package com.example.usersservice.utils.oAuth2;

public interface OAuth2UserInfo {

    String getProvider();
    String getProviderId();

    String getName();

    String getEmail();


}
