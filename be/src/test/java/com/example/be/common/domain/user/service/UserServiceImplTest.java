package com.example.be.common.domain.user.service;

import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.user.repository.UserRepository;
import com.example.be.common.domain.utils.jwt.JwtUtil;
import com.example.be.common.domain.utils.oauth2.GoogleUserInfo;
import com.example.be.common.domain.utils.oauth2.KakaoUserInfo;
import net.minidev.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private Map<String, Object> attributes;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .username("Test User_google")
                .nickname("Test User_google")
                .email("test@example.com")
                .oauth2Id("google_123")
                .provider("google")
                .providerId("123")
                .role(User.Role.COMMON)
                .password("Test User")
                .build();

        attributes = new HashMap<>();
        attributes.put("sub", "123");
        attributes.put("name", "Test User");
        attributes.put("email", "test@example.com");
    }

    @Nested
    @DisplayName("OAuth 회원가입 테스트")
    class SignupByOAuthTest {
        @Test
        @DisplayName("성공: OAuth 정보로 회원가입한다")
        void success() {
            // given
            GoogleUserInfo googleUserInfo = new GoogleUserInfo(attributes);
            given(userRepository.save(any(User.class))).willReturn(user);

            // when
            User result = userService.signupByOAuth(googleUserInfo);

            // then
            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo("Test User_google");
            assertThat(result.getNickname()).isEqualTo("Test User_google");
            assertThat(result.getProvider()).isEqualTo("google");
            verify(userRepository).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("사용자명으로 조회 테스트")
    class FindByUsernameTest {
        @Test
        @DisplayName("성공: 사용자명으로 사용자를 조회한다")
        void success() {
            // given
            given(userRepository.findByUsername(anyString()))
                    .willReturn(Optional.of(user));

            // when
            User result = userService.findByUsername("testUser");

            // then
            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo(user.getUsername());
            verify(userRepository).findByUsername("testUser");
        }

        @Test
        @DisplayName("실패: 존재하지 않는 사용자명으로 조회시 예외가 발생한다")
        void throwExceptionWhenUserNotFound() {
            // given
            given(userRepository.findByUsername(anyString()))
                    .willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> userService.findByUsername("nonexistent"))
                    .isInstanceOf(UsernameNotFoundException.class)
                    .hasMessage("User not found");
            verify(userRepository).findByUsername("nonexistent");
        }
    }

    @Nested
    @DisplayName("OAuth2 ID로 조회 테스트")
    class FindByOauth2IdTest {
        @Test
        @DisplayName("성공: OAuth2 ID로 사용자를 조회한다")
        void success() {
            // given
            given(userRepository.findByOauth2Id(anyString()))
                    .willReturn(Optional.of(user));

            // when
            User result = userService.findByOauth2Id("google_123");

            // then
            assertThat(result).isNotNull();
            assertThat(result.getOauth2Id()).isEqualTo(user.getOauth2Id());
            verify(userRepository).findByOauth2Id("google_123");
        }

        @Test
        @DisplayName("실패: 존재하지 않는 OAuth2 ID로 조회시 예외가 발생한다")
        void throwExceptionWhenUserNotFound() {
            // given
            given(userRepository.findByOauth2Id(anyString()))
                    .willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> userService.findByOauth2Id("nonexistent"))
                    .isInstanceOf(UsernameNotFoundException.class)
                    .hasMessage("User not found");
            verify(userRepository).findByOauth2Id("nonexistent");
        }
    }

    @Nested
    @DisplayName("OAuth2 ID 존재 여부 확인 테스트")
    class ExistByOauth2IdTest {
        @Test
        @DisplayName("성공: OAuth2 ID의 존재 여부를 확인한다")
        void success() {
            // given
            given(userRepository.existsByUsername(anyString()))
                    .willReturn(true);

            // when
            boolean result = userService.existByOauth2Id("google_123");

            // then
            assertThat(result).isTrue();
            verify(userRepository).existsByUsername("google_123");
        }
    }

    @Nested
    @DisplayName("회원 탈퇴 테스트")
    class DeleteAccountTest {
        @Test
        @DisplayName("성공: 사용자 계정을 삭제한다")
        void success() {
            // when
            boolean result = userService.deleteAccount(user);

            // then
            assertThat(result).isTrue();
            verify(userRepository).delete(user);
        }
    }

    @Nested
    @DisplayName("로그아웃 테스트")
    class LogoutTest {
        @Test
        @DisplayName("성공: 사용자 로그아웃을 처리한다")
        void success() {
            // given
            given(jwtUtil.deleteRefreshToken(anyString()))
                    .willReturn(true);

            // when
            boolean result = userService.logout(user);

            // then
            assertThat(result).isTrue();
            verify(jwtUtil).deleteRefreshToken(user.getUsername());
        }
    }

    @Nested
    @DisplayName("토큰 갱신 테스트")
    class RefreshAccessTokenTest {
        @Test
        @DisplayName("성공: 리프레시 토큰으로 새로운 액세스 토큰을 발급한다")
        void success() {
            // given
            String refreshToken = "validRefreshToken";
            given(jwtUtil.isRefreshTokenValid(anyString(), anyString()))
                    .willReturn(true);
            given(userRepository.findByUsername(anyString()))
                    .willReturn(Optional.of(user));
            given(jwtUtil.createAccessToken(anyString(), anyString()))
                    .willReturn("newAccessToken");

            // when
            JSONObject result = userService.refreshAccessToken(user.getUsername(), refreshToken);

            // then
            assertThat(result).isNotNull();
            assertThat(result.get("token")).isEqualTo("newAccessToken");
            verify(jwtUtil).isRefreshTokenValid(user.getUsername(), refreshToken);
        }

        @Test
        @DisplayName("실패: 유효하지 않은 리프레시 토큰으로 요청시 예외가 발생한다")
        void throwExceptionWhenInvalidRefreshToken() {
            // given
            String refreshToken = "invalidRefreshToken";
            given(jwtUtil.isRefreshTokenValid(anyString(), anyString()))
                    .willReturn(false);

            // when & then
            assertThatThrownBy(() -> userService.refreshAccessToken(user.getUsername(), refreshToken))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("해당 사용자는 재로그인을 진행해야합니다.");
        }
    }
}