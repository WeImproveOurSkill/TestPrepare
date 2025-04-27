package com.example.be.common.domain.exam.controller;

import com.example.be.common.config.TestSecurityConfig;
import com.example.be.common.domain.annotation.WithCustomMockUser;
import com.example.be.common.domain.exam.dtos.*;
import com.example.be.common.domain.exam.service.ExamService;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import com.example.be.common.domain.middleTable.userQuestion.service.UserQuestionService;
import com.example.be.common.domain.user.entity.User;
import com.example.be.common.domain.utils.jwt.JwtAuthFilter;
import com.example.be.common.domain.utils.jwt.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static com.example.be.common.domain.fixture.ExamFixture.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
@WebMvcTest(controllers = ExamController.class)
@MockBean(JpaMetamodelMappingContext.class)
@AutoConfigureRestDocs
@AutoConfigureMockMvc(addFilters = false)
@Import(TestSecurityConfig.class)
@WithCustomMockUser
class ExamControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExamService examService;

    @MockBean
    private UserQuestionService userQuestionService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @BeforeEach
    void setup() {
        // Mock 서비스 설정
        setupMockServices();
    }
    
    private void setupMockServices() {
        // ExamService 모의 설정
        List<CertificationDto> certificationDtos = createCertificationDtoList();
        List<CertificationTypeDto> certificationTypeDtos = createCertificationTypeDtoList();
        List<SubjectDto> subjectDtos = createSubjectDtoList();
        List<QuestionDto> questionDtos = createQuestionDtoList();
        
        given(examService.getCertificationList()).willReturn(certificationDtos);
        given(examService.getCertificationYearSessionInformationList(anyLong())).willReturn(certificationTypeDtos);
        given(examService.getSubject(anyLong())).willReturn(subjectDtos);
        given(examService.getRandomQuestionsBySubject(anyLong())).willReturn(questionDtos);
        given(examService.getQuestionsBySubject(anyLong(), anyInt(), anyInt())).willReturn(questionDtos);
        given(examService.getQuestionsBySubject(anyLong(), anyLong())).willReturn(createQuestionDto());
        
        // UserQuestionService 모의 설정
        willDoNothing().given(userQuestionService).testCheckAnswers(any(User.class), anyList());
        willDoNothing().given(userQuestionService).studyCheckAnswer(any(User.class), any(AnswerRecordDto.class));
        willDoNothing().given(userQuestionService).updateBookMark(any(User.class), anyLong());
        given(userQuestionService.getWrongQuestions(any(User.class), any(UserQuestion.Status.class))).willReturn(questionDtos);
        given(userQuestionService.getBookMarkQuestion(any(User.class), anyLong())).willReturn(questionDtos);
    }

    @Test
    @DisplayName("자격증 목록 조회 API")
    void getCertificationList() throws Exception {
        // Given
        List<CertificationDto> expectedResponse = createCertificationDtoList();

        // When & Then
        mockMvc.perform(get("/exam")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].certificationId").exists())
                .andExpect(jsonPath("$[0].certificationName").exists())
                .andDo(document("certification-list",
                        preprocessResponse(prettyPrint()),
                        responseFields(
                                fieldWithPath("[].certificationId").type(JsonFieldType.NUMBER)
                                        .description("자격증 ID"),
                                fieldWithPath("[].certificationName").type(JsonFieldType.STRING)
                                        .description("자격증 이름")
                        )
                ));
    }

    @Test
    @DisplayName("자격증 연도/회차 목록 조회 API")
    void getSubjectYearSessionInformationList() throws Exception {
        // Given
        Long certificationId = 1L;

        // When & Then
        mockMvc.perform(get("/exam/certification/{certificationId}/year-session", certificationId)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].year").exists())
                .andExpect(jsonPath("$[0].session").exists())
                .andDo(document("certification-year-session",
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
        // Given
        Long certificationId = 1L;

        // When & Then
        mockMvc.perform(get("/exam/certification/{certificationId}", certificationId)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subjectId").exists())
                .andExpect(jsonPath("$[0].subjectName").exists())
                .andDo(document("subject-list",
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
    void getRandomQuestionsBySubject() throws Exception {
        // Given
        Long subjectId = 1L;

        // When & Then
        mockMvc.perform(get("/exam/subject/{subjectId}/random", subjectId)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionId").exists())
                .andExpect(jsonPath("$[0].content").exists())
                .andDo(document("random-questions",
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
                                fieldWithPath("[].explanation").type(JsonFieldType.STRING)
                                        .description("해설")
                        )
                ));
    }

    @Test
    @DisplayName("시험 모드 문제 제출 API")
    void testCheckAnswers() throws Exception {
        // Given
        List<AnswerSubmitDTO> request = createAnswerSubmitDTOList();

        // When & Then
        mockMvc.perform(post("/exam/submit/test")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("submit-test-answers",
                        preprocessRequest(prettyPrint()),
                        requestFields(
                                fieldWithPath("[].questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("[].answer").type(JsonFieldType.STRING)
                                        .description("정답"),
                                fieldWithPath("[].userAnswer").type(JsonFieldType.STRING)
                                        .description("제출한 답안")
                        )
                ));
    }

    @Test
    @DisplayName("일반 문제 풀이 제출 API")
    void studyCheckAnswer() throws Exception {
        // Given
        AnswerRecordDto request = createAnswerRecordDto();

        // When & Then
        mockMvc.perform(post("/exam/submit/normal")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("submit-normal-answer",
                        preprocessRequest(prettyPrint()),
                        requestFields(
                                fieldWithPath("questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("status").type(JsonFieldType.STRING)
                                        .description("문제 상태 (CORRECT, WRONG)")
                        )
                ));
    }

    @Test
    @DisplayName("틀린 문제 조회 API")
    void getWrongQuestions() throws Exception {
        // Given
        String status = UserQuestion.Status.WRONG.name();

        // When & Then
        mockMvc.perform(RestDocumentationRequestBuilders.get("/exam/wrong-questions")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .queryParam("status", status))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionId").exists())
                .andExpect(jsonPath("$[0].content").exists())
                .andDo(document("wrong-questions",
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
                                fieldWithPath("[].explanation").type(JsonFieldType.STRING)
                                        .description("해설")
                        )
                ));
    }

    @Test
    @DisplayName("북마크 업데이트 API")
    void updateBookMark() throws Exception {
        // Given
        Long questionId = 1L;

        // When & Then
        mockMvc.perform(RestDocumentationRequestBuilders.patch("/exam/book-mark")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .queryParam("questionId", String.valueOf(questionId)))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("update-bookmark",
                        preprocessRequest(prettyPrint()),
                        queryParameters(
                                parameterWithName("questionId").description("문제 ID")
                        )
                ));
    }

    @Test
    @DisplayName("북마크된 문제 조회 API")
    void getBookMarkQuestions() throws Exception {
        // Given
        Long certificationId = 1L;

        // When & Then
        mockMvc.perform(RestDocumentationRequestBuilders.get("/exam/book-mark/question")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .queryParam("certificationId", String.valueOf(certificationId)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionId").exists())
                .andExpect(jsonPath("$[0].content").exists())
                .andDo(document("bookmarked-questions",
                        queryParameters(
                                parameterWithName("certificationId").description("자격증 ID")
                        ),
                        responseFields(
                                fieldWithPath("[].questionId").type(JsonFieldType.NUMBER)
                                        .description("문제 ID"),
                                fieldWithPath("[].content").type(JsonFieldType.STRING)
                                        .description("문제 내용"),
                                fieldWithPath("[].answer").type(JsonFieldType.STRING)
                                        .description("정답"),
                                fieldWithPath("[].explanation").type(JsonFieldType.STRING)
                                        .description("해설")
                        )
                ));
    }
}