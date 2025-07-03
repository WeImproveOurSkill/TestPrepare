package com.example.usersservice.service;

import com.example.usersservice.entity.User;
import com.example.usersservice.utils.oAuth2.OAuth2UserInfo;
import net.minidev.json.JSONObject;

import java.text.ParseException;

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
