package com.example.usersservice.controller;


import com.example.usersservice.service.UserService;
import com.example.usersservice.utils.userDetailsImpl.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
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

    @PostMapping("/refresh")
    public ResponseEntity<JSONObject> refreshToken(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String refreshToken = payload.get("refreshToken");

        if (username == null || refreshToken == null) {
            throw new IllegalArgumentException("사용자명과 리프레시 토큰은 필수입니다.");
        }

        JSONObject response = userService.refreshToken(username, refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetailsImpl user) {
        try {
            // 사용자 객체가 null인지 확인
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "status", "error",
                        "message", "인증되지 않은 사용자입니다."
                ));
            }

            boolean result = userService.logout(user.getUser());

            // 성공/실패에 따른 응답 구분
            if (result) {
                return ResponseEntity.ok().body(Map.of(
                        "status", "success",
                        "message", "로그아웃 처리되었습니다."
                ));
            } else {
                return ResponseEntity.ok().body(Map.of(
                        "status", "warning",
                        "message", "이미 로그아웃 되었거나 세션이 만료되었습니다."
                ));
            }
        } catch (Exception e) {
            // 예외 발생 시 로그 기록 및 오류 응답
            log.error("로그아웃 처리 중 예외 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "error",
                    "message", "서버 오류로 로그아웃 처리에 실패했습니다."
            ));
        }
    }

    @DeleteMapping("/user")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserDetailsImpl user) {
        try {
            boolean result = userService.deleteAccount(user.getUser());

            // 3. 결과에 따른 응답 생성
            if (result) {
                return ResponseEntity.ok()
                        .body(Map.of(
                                "status", "success",
                                "message", "회원탈퇴가 완료되었습니다"
                        ));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "status", "error",
                                "message", "회원탈퇴 처리 중 오류가 발생했습니다"
                        ));
            }
        } catch (Exception e) {
            // 기타 서버 오류
            log.error("회원탈퇴 처리 중 예상치 못한 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "서버 오류가 발생했습니다"
                    ));
        }
    }

}
