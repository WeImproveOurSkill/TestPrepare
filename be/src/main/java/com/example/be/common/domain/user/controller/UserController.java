package com.example.be.common.domain.user.controller;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
        
        JSONObject response = userService.refreshAccessToken(username, refreshToken);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal User user) {
        boolean result = userService.logout(user);
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
    }

    @DeleteMapping("/user")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal User user) {
        try {
            boolean result = userService.deleteAccount(user);

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
