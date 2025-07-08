package com.example.questionsserver.controller;

import com.example.questionsserver.common.ApiDocumentUtils;
import com.example.questionsserver.dtos.*;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import com.example.questionsserver.fixtures.ExamFixture;
import com.example.questionsserver.service.ExamService;
import com.example.questionsserver.service.middleTable.UserQuestionService;
import com.example.questionsserver.utils.jwt.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;


import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.headers.HeaderDocumentation.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
@WebMvcTest(controllers = ExamController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
    org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class,
    org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration.class
})
@AutoConfigureRestDocs
class BasicExamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExamService examService;
    
    @MockBean
    private UserQuestionService userQuestionService;
    
    @MockBean
    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        // JWT Utils Mock
        when(jwtUtils.extractUsername(anyString())).thenReturn("testuser");
    }

    @Test
    @DisplayName("자격증 목록 조회 API")
    void getCertificationList() throws Exception {
        // given
        when(examService.getCertificationList()).thenReturn(ExamFixture.createCertificationList());

        // when & then
        mockMvc.perform(get("/exam")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].certificationId").exists())
                .andExpect(jsonPath("$[0].certificationName").exists())
                .andDo(document("certification-list",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        responseFields(
                                fieldWithPath("[].certificationId").type(JsonFieldType.NUMBER)
                                        .description("자격증 ID"),
                                fieldWithPath("[].certificationName").type(JsonFieldType.STRING)
                                        .description("자격증 이름")
                        )
                ));
    }

    @Test
    @DisplayName("자격증 목록 조회 API (Simple)")
    void getCertificationListSimple() throws Exception {
        // given
        when(examService.getCertificationList()).thenReturn(ExamFixture.createCertificationList());

        // when & then
        mockMvc.perform(get("/exam")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andDo(document("certification-list-simple",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse()
                ));
    }

    @Test
    @DisplayName("자격증 연도/회차 정보 조회 API")
    void getCertificationYearSessionInformation() throws Exception {
        // given
        when(examService.getCertificationYearSessionInformationList(anyLong()))
                .thenReturn(ExamFixture.createCertificationTypeList());

        // when & then
        mockMvc.perform(get("/exam/certification/{certificationId}/year-session", 1L)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].year").exists())
                .andExpect(jsonPath("$[0].session").exists())
                .andDo(document("certification-year-session",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        pathParameters(
                                parameterWithName("certificationId").description("자격증 ID")
                        ),
                        responseFields(
                                fieldWithPath("[].year").type(JsonFieldType.NUMBER)
                                        .description("시험 연도"),
                                fieldWithPath("[].session").type(JsonFieldType.NUMBER)
                                        .description("시험 회차")
                        )
                ));
    }

    @Test
    @DisplayName("자격증별 과목 목록 조회 API")
    void getSubjectList() throws Exception {
        // given
        when(examService.getSubject(anyLong())).thenReturn(ExamFixture.createSubjectList());

        // when & then
        mockMvc.perform(get("/exam/certification/{certificationId}", 1L)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subjectId").exists())
                .andExpect(jsonPath("$[0].subjectName").exists())
                .andDo(document("subject-list",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        pathParameters(
                                parameterWithName("certificationId").description("자격증 ID")
                        ),
                        responseFields(
                                fieldWithPath("[].subjectId").type(JsonFieldType.NUMBER)
                                        .description("과목 ID"),
                                fieldWithPath("[].subjectName").type(JsonFieldType.STRING)
                                        .description("과목 이름")
                        )
                ));
    }

    @Test
    @DisplayName("과목별 랜덤 문제 조회 API")
    void getRandomQuestions() throws Exception {
        // given
        when(examService.getRandomQuestionsBySubject(anyLong())).thenReturn(ExamFixture.createQuestionList());

        // when & then
        mockMvc.perform(get("/exam/subject/{subjectId}/random", 1L)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionId").exists())
                .andExpect(jsonPath("$[0].content").exists())
                .andExpect(jsonPath("$[0].answer").exists())
                .andExpect(jsonPath("$[0].explantion").exists())
                .andDo(document("random-questions",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        pathParameters(
                                parameterWithName("subjectId").description("과목 ID")
                        ),
                        responseFields(
                                fieldWithPath("[].questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("[].content").type(JsonFieldType.STRING)
                                        .description("문제 내용"),
                                fieldWithPath("[].answer").type(JsonFieldType.STRING)
                                        .description("정답"),
                                fieldWithPath("[].explantion").type(JsonFieldType.STRING)
                                        .description("문제 해설")
                        )
                ));
    }

    @Test
    @DisplayName("과목별 기출 문제 조회 API")
    void getQuestionsBySubjectAndYearSession() throws Exception {
        // given
        when(examService.getQuestionsBySubject(anyLong(), anyInt(), anyInt()))
                .thenReturn(ExamFixture.createQuestionList());

        // when & then
        mockMvc.perform(get("/exam/subject/{subjectId}/year/{year}/session/{session}", 1L, 2023, 1)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionId").exists())
                .andExpect(jsonPath("$[0].content").exists())
                .andExpect(jsonPath("$[0].answer").exists())
                .andExpect(jsonPath("$[0].explantion").exists())
                .andDo(document("exam-questions",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        pathParameters(
                                parameterWithName("subjectId").description("과목 ID"),
                                parameterWithName("year").description("시험 연도"),
                                parameterWithName("session").description("시험 회차")
                        ),
                        responseFields(
                                fieldWithPath("[].questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("[].content").type(JsonFieldType.STRING)
                                        .description("문제 내용"),
                                fieldWithPath("[].answer").type(JsonFieldType.STRING)
                                        .description("정답"),
                                fieldWithPath("[].explantion").type(JsonFieldType.STRING)
                                        .description("문제 해설")
                        )
                ));
    }

    @Test
    @DisplayName("deprecated 과목별 단일 문제 조회 API")
    void getQuestionsBySubjectDeprecated() throws Exception {
        // given
        when(examService.getQuestionsBySubject(anyLong(), anyLong()))
                .thenReturn(ExamFixture.createSingleQuestion());

        // when & then
        mockMvc.perform(get("/exam/subject/{subjectId}/question", 1L)
                        .param("questionId", "1")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionId").exists())
                .andExpect(jsonPath("$.content").exists())
                .andExpect(jsonPath("$.answer").exists())
                .andExpect(jsonPath("$.explantion").exists())
                .andDo(document("single-question",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        pathParameters(
                                parameterWithName("subjectId").description("과목 ID")
                        ),
                        queryParameters(
                                parameterWithName("questionId").description("문제 ID (기본값: 0)")
                        ),
                        responseFields(
                                fieldWithPath("questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("content").type(JsonFieldType.STRING)
                                        .description("문제 내용"),
                                fieldWithPath("answer").type(JsonFieldType.STRING)
                                        .description("정답"),
                                fieldWithPath("explantion").type(JsonFieldType.STRING)
                                        .description("문제 해설")
                        )
                ));
    }

    @Test
    @DisplayName("틀린 문제 조회 API")
    void getWrongQuestions() throws Exception {
        // given
        when(userQuestionService.getWrongQuestions(anyString(), any(UserQuestion.Status.class)))
                .thenReturn(ExamFixture.createQuestionList());

        // when & then
        mockMvc.perform(get("/exam/wrong-questions")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token-here")
                        .param("status", "WRONG")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionId").exists())
                .andExpect(jsonPath("$[0].content").exists())
                .andExpect(jsonPath("$[0].answer").exists())
                .andExpect(jsonPath("$[0].explantion").exists())
                .andDo(document("wrong-questions",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        requestHeaders(
                                headerWithName("Authorization").description("JWT 인증 토큰")
                        ),
                        queryParameters(
                                parameterWithName("status").description("문제 상태 (WRONG, CORRECT 등)")
                        ),
                        responseFields(
                                fieldWithPath("[].questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("[].content").type(JsonFieldType.STRING)
                                        .description("문제 내용"),
                                fieldWithPath("[].answer").type(JsonFieldType.STRING)
                                        .description("정답"),
                                fieldWithPath("[].explantion").type(JsonFieldType.STRING)
                                        .description("문제 해설")
                        )
                ));
    }

    @Test
    @DisplayName("일반 문제풀이 제출 API")
    void studyCheckAnswer() throws Exception {
        // given
        doNothing().when(userQuestionService).studyCheckAnswer(anyString(), any(AnswerRecordDto.class));

        String requestBody = objectMapper.writeValueAsString(ExamFixture.createAnswerRecord());

        // when & then
        mockMvc.perform(post("/exam/submit/normal")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token-here")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                        .content(requestBody))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("submit-normal-answer",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        requestHeaders(
                                headerWithName("Authorization").description("JWT 인증 토큰")
                        ),
                        requestFields(
                                fieldWithPath("questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("status").type(JsonFieldType.STRING)
                                        .description("문제 상태 (CORRECT, WRONG 등)")
                        )
                ));
    }

    @Test
    @DisplayName("시험 모드 문제풀이 제출 API")
    void testCheckAnswers() throws Exception {
        // given
        doNothing().when(userQuestionService).testCheckAnswers(anyString(), anyList());

        String requestBody = objectMapper.writeValueAsString(ExamFixture.createAnswerSubmitList());

        // when & then
        mockMvc.perform(post("/exam/submit/test")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token-here")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                        .content(requestBody))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("submit-test-answers",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        requestHeaders(
                                headerWithName("Authorization").description("JWT 인증 토큰")
                        ),
                        requestFields(
                                fieldWithPath("[].questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("[].answer").type(JsonFieldType.STRING)
                                        .description("정답"),
                                fieldWithPath("[].userAnswer").type(JsonFieldType.STRING)
                                        .description("사용자 답안")
                        )
                ));
    }

    @Test
    @DisplayName("북마크 생성 API")
    void createBookmark() throws Exception {
        // given
        doNothing().when(userQuestionService).createBookMark(anyString(), anyLong());

        // when & then
        mockMvc.perform(post("/exam/book-mark")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token-here")
                        .param("questionId", "1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("create-bookmark",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        requestHeaders(
                                headerWithName("Authorization").description("JWT 인증 토큰")
                        )
                ));
    }

    @Test
    @DisplayName("북마크 삭제 API")
    void deleteBookmark() throws Exception {
        // given
        doNothing().when(userQuestionService).deleteBookMark(anyString(), anyLong());

        // when & then
        mockMvc.perform(delete("/exam/book-mark")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token-here")
                        .param("questionId", "1")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("delete-bookmark",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        requestHeaders(
                                headerWithName("Authorization").description("JWT 인증 토큰")
                        )
                ));
    }

    @Test
    @DisplayName("북마크된 문제 조회 API")
    void getBookmarkQuestions() throws Exception {
        // given
        when(userQuestionService.getBookMarkQuestion(anyString(), anyLong()))
                .thenReturn(ExamFixture.createQuestionList());

        // when & then
        mockMvc.perform(get("/exam/book-mark/question")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token-here")
                        .param("certificationId", "1")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionId").exists())
                .andExpect(jsonPath("$[0].content").exists())
                .andExpect(jsonPath("$[0].answer").exists())
                .andExpect(jsonPath("$[0].explantion").exists())
                .andDo(document("bookmarked-questions",
                        ApiDocumentUtils.getDocumentRequest(),
                        ApiDocumentUtils.getDocumentResponse(),
                        requestHeaders(
                                headerWithName("Authorization").description("JWT 인증 토큰")
                        ),
                        responseFields(
                                fieldWithPath("[].questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("[].content").type(JsonFieldType.STRING)
                                        .description("문제 내용"),
                                fieldWithPath("[].answer").type(JsonFieldType.STRING)
                                        .description("정답"),
                                fieldWithPath("[].explantion").type(JsonFieldType.STRING)
                                        .description("문제 해설")
                        )
                ));
    }
}