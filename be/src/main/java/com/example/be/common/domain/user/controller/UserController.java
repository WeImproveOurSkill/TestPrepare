package com.example.be.common.domain.user.controller;

import com.example.be.common.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.ParseException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/oauth/callback/kakao")
    public JSONObject KakaoCallback(@RequestBody JSONObject object) throws ParseException {
        return userService.kakaoCallback(object);
    }

    @PostMapping("/oauth/callback/google")
    public JSONObject googleCallback(@RequestBody JSONObject object) throws ParseException {
        return userService.googleCallback(object);
    }

}
