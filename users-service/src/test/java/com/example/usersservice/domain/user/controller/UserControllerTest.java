package com.example.usersservice.domain.user.controller;


import com.example.usersservice.annotation.WithCustomMockUser;
import com.example.usersservice.controller.UserController;
import com.example.usersservice.service.UserService;
import com.example.usersservice.utils.jwt.JwtAuthFilter;
import com.example.usersservice.utils.jwt.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.minidev.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.delete;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
@WebMvcTest(UserController.class)
@MockBean(JpaMetamodelMappingContext.class)
@AutoConfigureRestDocs
class UserControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    UserService userService;
    
    @MockBean
    JwtUtils jwtUtil;
    
    @MockBean
    JwtAuthFilter jwtAuthFilter;

    @BeforeEach
    void setup(RestDocumentationContextProvider restDocumentation) {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .apply(documentationConfiguration(restDocumentation)
                        .operationPreprocessors()
                        .withRequestDefaults(prettyPrint())
                        .withResponseDefaults(prettyPrint()))
                .build();
    }

    @Test
    @WithMockUser
    void kakaoCallback() throws Exception {
        // Given
        JSONObject requestBody = new JSONObject();
        requestBody.put("code", "test_authorization_code");
        requestBody.put("state", "test_state");

        JSONObject responseBody = new JSONObject();
        responseBody.put("accessToken", "test_access_token");
        responseBody.put("refreshToken", "test_refresh_token");
        responseBody.put("nickname", "test_user");
        responseBody.put("email", "test@example.com");
        
        given(userService.kakaoCallback(any(JSONObject.class))).willReturn(responseBody);

        // When & Then
        mockMvc.perform(
            post("/oauth/callback/kakao")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andDo(document("kakao-login",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("code").type(JsonFieldType.STRING)
                                        .description("카카오 인증 코드"),
                                fieldWithPath("state").type(JsonFieldType.STRING)
                                        .description("상태 값")
                        ),
                        responseFields(
                                fieldWithPath("accessToken").type(JsonFieldType.STRING)
                                        .description("액세스 토큰"),
                                fieldWithPath("refreshToken").type(JsonFieldType.STRING)
                                        .description("리프레시 토큰"),
                                fieldWithPath("nickname").type(JsonFieldType.STRING)
                                        .description("사용자 닉네임"),
                                fieldWithPath("email").type(JsonFieldType.STRING)
                                        .description("사용자 이메일")
                        )
                ));
    }

    @Test
    @WithMockUser
    void googleCallback() throws Exception {
        // Given
        JSONObject requestBody = new JSONObject();
        requestBody.put("code", "test_google_auth_code");
        requestBody.put("state", "test_state");

        JSONObject responseBody = new JSONObject();
        responseBody.put("accessToken", "test_google_access_token");
        responseBody.put("refreshToken", "test_google_refresh_token");
        responseBody.put("nickname", "test_google_user");
        responseBody.put("email", "test.google@example.com");
        
        given(userService.googleCallback(any(JSONObject.class))).willReturn(responseBody);

        // When & Then
        mockMvc.perform(
            post("/oauth/callback/google")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andDo(document("google-login",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("code").type(JsonFieldType.STRING)
                                        .description("구글 인증 코드"),
                                fieldWithPath("state").type(JsonFieldType.STRING)
                                        .description("상태 값")
                        ),
                        responseFields(
                                fieldWithPath("accessToken").type(JsonFieldType.STRING)
                                        .description("액세스 토큰"),
                                fieldWithPath("refreshToken").type(JsonFieldType.STRING)
                                        .description("리프레시 토큰"),
                                fieldWithPath("nickname").type(JsonFieldType.STRING)
                                        .description("사용자 닉네임"),
                                fieldWithPath("email").type(JsonFieldType.STRING)
                                        .description("사용자 이메일")
                        )
                ));
    }

    @Test
    @WithMockUser
    void refreshToken() throws Exception {
        // Given
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "testUser");
        requestBody.put("refreshToken", "test_refresh_token");

        JSONObject responseBody = new JSONObject();
        responseBody.put("accessToken", "new_access_token");
        responseBody.put("refreshToken", "new_refresh_token");
        
        given(userService.refreshToken(anyString(), anyString())).willReturn(responseBody);

        // When & Then
        mockMvc.perform(
            post("/refresh")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andDo(document("refresh-token",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("username").type(JsonFieldType.STRING)
                                        .description("사용자 이름"),
                                fieldWithPath("refreshToken").type(JsonFieldType.STRING)
                                        .description("리프레시 토큰")
                        ),
                        responseFields(
                                fieldWithPath("accessToken").type(JsonFieldType.STRING)
                                        .description("새로운 액세스 토큰"),
                                fieldWithPath("refreshToken").type(JsonFieldType.STRING)
                                        .description("새로운 리프레시 토큰")
                        )
                ));
    }

    @Test
    @WithCustomMockUser
    void logout() throws Exception {
        // Given
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("status", "success");
        responseBody.put("message", "로그아웃 처리되었습니다.");
        
        given(userService.logout(any())).willReturn(true);

        // When & Then
        mockMvc.perform(
            post("/user/logout")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("로그아웃 처리되었습니다."))
                .andDo(document("user-logout",
                        preprocessResponse(prettyPrint()),
                        responseFields(
                                fieldWithPath("status").type(JsonFieldType.STRING)
                                        .description("처리 상태"),
                                fieldWithPath("message").type(JsonFieldType.STRING)
                                        .description("처리 메시지")
                        )
                ));
    }

    @Test
    @WithCustomMockUser
    void deleteAccount() throws Exception {
        // Given
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("status", "success");
        responseBody.put("message", "회원탈퇴가 완료되었습니다");
        
        given(userService.deleteAccount(any())).willReturn(true);

        // When & Then
        mockMvc.perform(
            delete("/user")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("회원탈퇴가 완료되었습니다"))
                .andDo(document("user-delete",
                        preprocessResponse(prettyPrint()),
                        responseFields(
                                fieldWithPath("status").type(JsonFieldType.STRING)
                                        .description("처리 상태"),
                                fieldWithPath("message").type(JsonFieldType.STRING)
                                        .description("처리 메시지")
                        )
                ));
    }
}