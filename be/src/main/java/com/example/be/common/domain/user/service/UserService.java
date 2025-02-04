package com.example.be.common.domain.user.service;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.utils.oauth2.OAuth2UserInfo;

import java.util.Optional;

public interface UserService {

    User signupByOAuth(OAuth2UserInfo oAuth2User);

    User findByUsername(String username);

    User findByOauth2Id(String username);

    boolean existByOauth2Id(String username);
}
