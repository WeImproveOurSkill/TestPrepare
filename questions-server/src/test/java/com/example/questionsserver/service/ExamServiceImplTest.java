package com.example.questionsserver.service;

import com.example.questionsserver.dtos.CertificationDto;
import com.example.questionsserver.dtos.CertificationTypeDto;
import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.dtos.SubjectDto;
import com.example.questionsserver.entity.Question;
import com.example.questionsserver.fixtures.ExamFixture;
import com.example.questionsserver.repository.main.answer.AnswerRepository;
import com.example.questionsserver.repository.main.certification.CertificationRepository;
import com.example.questionsserver.repository.main.question.QuestionRepository;
import com.example.questionsserver.repository.main.subjectExam.SubjectExamRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExamServiceImplTest {

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private SubjectExamRepository subjectRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerRepository answerRepository;

    @InjectMocks
    private ExamServiceImpl examService;

    @Test
    @DisplayName("자격증 목록을 조회한다")
    void getCertificationList() {
        // given
        List<CertificationDto> expectedCertifications = ExamFixture.createCertificationList();
        when(certificationRepository.findAllByCertificationInformation())
                .thenReturn(expectedCertifications);

        // when
        List<CertificationDto> result = examService.getCertificationList();

        // then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).certificationName()).isEqualTo("정보처리기사");
        assertThat(result.get(1).certificationName()).isEqualTo("컴활1급");
    }

    @Test
    @DisplayName("자격증 ID로 연도/회차 정보를 조회한다")
    void getCertificationYearSessionInformationList() {
        // given
        Long certificationId = 1L;
        List<CertificationTypeDto> expectedTypes = ExamFixture.createCertificationTypeList();
        when(certificationRepository.findAllYearAndSessionByCertificationId(certificationId))
                .thenReturn(expectedTypes);

        // when
        List<CertificationTypeDto> result = examService.getCertificationYearSessionInformationList(certificationId);

        // then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).year()).isEqualTo(2023);
        assertThat(result.get(0).session()).isEqualTo(1);
        assertThat(result.get(1).year()).isEqualTo(2023);
        assertThat(result.get(1).session()).isEqualTo(2);
    }

    @Test
    @DisplayName("자격증 ID로 과목 목록을 조회한다")
    void getSubject() {
        // given
        Long certificationId = 1L;
        List<SubjectDto> expectedSubjects = ExamFixture.createSubjectList();
        when(subjectRepository.getSubjectByCertificationId(certificationId))
                .thenReturn(expectedSubjects);

        // when
        List<SubjectDto> result = examService.getSubject(certificationId);

        // then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).subjectName()).isEqualTo("소프트웨어 설계");
        assertThat(result.get(1).subjectName()).isEqualTo("프로그래밍 언어 활용");
    }

    @Test
    @DisplayName("자격증명, 연도, 회차로 기출문제를 조회한다")
    void getQuestionsByCertification() {
        // given
        String certificationName = "정보처리기사";
        int year = 2023;
        int session = 1;
        List<QuestionDto> expectedQuestions = ExamFixture.createQuestionList();
        when(certificationRepository.findAllQuestionByNameAndYearAndSession(certificationName, year, session))
                .thenReturn(expectedQuestions);

        // when
        List<QuestionDto> result = examService.getQuestionsByCertification(certificationName, year, session);

        // then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).content()).isEqualTo("문제 내용");
        assertThat(result.get(0).answer()).isEqualTo("4");
    }

    @Test
    @DisplayName("과목 ID와 문제 ID로 특정 문제를 조회한다")
    void getQuestionsBySubject() {
        // given
        Long subjectId = 1L;
        Long questionId = 1L;
        QuestionDto expectedQuestion = ExamFixture.createSingleQuestion();
        when(questionRepository.findQuestionBySubjectAndQuestionId(subjectId, questionId))
                .thenReturn(expectedQuestion);

        // when
        QuestionDto result = examService.getQuestionsBySubject(subjectId, questionId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.questionId()).isEqualTo(1L);
        assertThat(result.content()).isEqualTo("문제 내용");
        assertThat(result.answer()).isEqualTo("4");
        assertThat(result.explanation()).isEqualTo("해설");
    }

    @Test
    @DisplayName("과목 ID로 랜덤 문제들을 조회한다")
    void getRandomQuestionsBySubject() {
        // given
        Long subjectId = 1L;
        List<QuestionDto> expectedQuestions = ExamFixture.createQuestionList();
        when(questionRepository.findAllbySubjectIdAndRandomNumber(subjectId))
                .thenReturn(expectedQuestions);

        // when
        List<QuestionDto> result = examService.getRandomQuestionsBySubject(subjectId);

        // then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).content()).isEqualTo("문제 내용");
    }

    @Test
    @DisplayName("과목 ID, 연도, 회차로 문제들을 조회한다")
    void getQuestionsBySubjectAndYearSession() {
        // given
        Long subjectId = 1L;
        int year = 2023;
        int session = 1;
        List<QuestionDto> expectedQuestions = ExamFixture.createQuestionList();
        when(questionRepository.findAllQuestionBySubjectAndYearSession(subjectId, year, session))
                .thenReturn(expectedQuestions);

        // when
        List<QuestionDto> result = examService.getQuestionsBySubject(subjectId, year, session);

        // then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).questionId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("문제 ID로 Question 엔티티를 조회한다")
    void findById() {
        // given
        Long questionId = 1L;
        Question mockQuestion = Question.builder()
                .id(questionId)
                .content("문제 내용")
                .imageLink("test-image.jpg")
                .build();
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(mockQuestion));

        // when
        Question result = examService.findById(questionId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(questionId);
        assertThat(result.getContent()).isEqualTo("문제 내용");
        assertThat(result.getImageLink()).isEqualTo("test-image.jpg");
    }

    @Test
    @DisplayName("존재하지 않는 문제 ID로 조회시 예외가 발생한다")
    void findById_NotFound() {
        // given
        Long questionId = 999L;
        when(questionRepository.findById(questionId)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> examService.findById(questionId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("존재하지 않는 문제입니다.");
    }
}