package com.example.be.common.domain.user.service;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.utils.oauth2.OAuth2UserInfo;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.ParseException;

public interface UserService {

    User signupByOAuth(OAuth2UserInfo oAuth2User);

    User findByUsername(String username);

    User findByOauth2Id(String username);

    boolean existByOauth2Id(String username);

    JSONObject kakaoCallback(JSONObject object) throws ParseException;

    JSONObject googleCallback(JSONObject object);

    JSONObject refreshToken(String username, String refreshToken);

    boolean logout(User username);

    boolean deleteAccount(User user);
}
