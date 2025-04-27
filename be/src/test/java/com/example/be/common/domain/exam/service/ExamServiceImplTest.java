package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.dtos.*;
import com.example.be.common.domain.exam.entity.*;
import com.example.be.common.domain.exam.repository.AnswerRepository;
import com.example.be.common.domain.exam.repository.certification.CertificationRepository;
import com.example.be.common.domain.exam.repository.question.QuestionRepository;
import com.example.be.common.domain.exam.repository.subject.SubjectRepository;
import com.example.be.common.domain.fixture.ExamFixture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ExamServiceImplTest {

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerRepository answerRepository;

    @InjectMocks
    private ExamServiceImpl examService;

    private Certification certification;
    private SubjectExam subjectExam;
    private Question question;
    private List<QuestionDto> questionDtos;
    private List<CertificationDto> certificationDtos;
    private List<SubjectDto> subjectDtos;
    private List<CertificationTypeDto> certificationTypeDtos;

    @BeforeEach
    void setUp() {
        certification = ExamFixture.createCertification();
        subjectExam = ExamFixture.createSubjectExam();
        question = ExamFixture.createQuestion();
        
        questionDtos = Arrays.asList(ExamFixture.createQuestionDto());
        certificationDtos = Arrays.asList(ExamFixture.createCertificationDto());
        subjectDtos = Arrays.asList(ExamFixture.createSubjectDto());
        certificationTypeDtos = Arrays.asList(ExamFixture.createCertificationTypeDto());
    }

    @Nested
    @DisplayName("자격증 문제 목록 조회 테스트")
    class GetQuestionsByCertificationTest {
        @Test
        @DisplayName("성공: 자격증 이름, 년도, 회차로 문제 목록을 조회한다")
        void success() {
            // given
            String certificationName = "정보처리기사";
            int year = 2024;
            int session = 1;
            
            given(certificationRepository.findAllQuestionByNameAndYearAndSession(anyString(), anyInt(), anyInt()))
                    .willReturn(questionDtos);

            // when
            List<QuestionDto> result = examService.getQuestionsByCertification(certificationName, year, session);

            // then
            assertThat(result).isNotEmpty();
            assertThat(result).hasSize(questionDtos.size());
            verify(certificationRepository).findAllQuestionByNameAndYearAndSession(certificationName, year, session);
        }

        @Test
        @DisplayName("실패: 존재하지 않는 자격증 정보로 조회시 빈 리스트를 반환한다")
        void returnEmptyListWhenCertificationNotFound() {
            // given
            String certificationName = "존재하지않는자격증";
            int year = 2024;
            int session = 1;
            
            given(certificationRepository.findAllQuestionByNameAndYearAndSession(anyString(), anyInt(), anyInt()))
                    .willReturn(Collections.emptyList());

            // when
            List<QuestionDto> result = examService.getQuestionsByCertification(certificationName, year, session);

            // then
            assertThat(result).isEmpty();
            verify(certificationRepository).findAllQuestionByNameAndYearAndSession(certificationName, year, session);
        }
    }

    @Nested
    @DisplayName("과목별 문제 조회 테스트")
    class GetQuestionsBySubjectTest {
        @Test
        @DisplayName("성공: 과목 ID와 문제 ID로 특정 문제를 조회한다")
        void success() {
            // given
            Long subjectId = 1L;
            Long questionId = 1L;
            QuestionDto questionDto = ExamFixture.createQuestionDto();
            
            given(questionRepository.findByQuestionBySubjectSizeCount(anyLong(), anyLong()))
                    .willReturn(questionDto);

            // when
            QuestionDto result = examService.getQuestionsBySubject(subjectId, questionId);

            // then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).isEqualTo(questionDto.getContent());
            verify(questionRepository).findByQuestionBySubjectSizeCount(subjectId, questionId);
        }

        @Test
        @DisplayName("실패: 존재하지 않는 과목 ID로 조회시 null을 반환한다")
        void returnNullWhenSubjectNotFound() {
            // given
            Long subjectId = 999L;
            Long questionId = 1L;
            
            given(questionRepository.findByQuestionBySubjectSizeCount(anyLong(), anyLong()))
                    .willReturn(null);

            // when
            QuestionDto result = examService.getQuestionsBySubject(subjectId, questionId);

            // then
            assertThat(result).isNull();
            verify(questionRepository).findByQuestionBySubjectSizeCount(subjectId, questionId);
        }
    }

    @Nested
    @DisplayName("자격증 목록 조회 테스트")
    class GetCertificationListTest {
        @Test
        @DisplayName("성공: 전체 자격증 목록을 조회한다")
        void success() {
            // given
            given(certificationRepository.findAllByCertificationInformation())
                    .willReturn(certificationDtos);

            // when
            List<CertificationDto> result = examService.getCertificationList();

            // then
            assertThat(result).isNotEmpty();
            assertThat(result).hasSize(certificationDtos.size());
            verify(certificationRepository).findAllByCertificationInformation();
        }

        @Test
        @DisplayName("실패: 자격증이 없을 경우 빈 리스트를 반환한다")
        void returnEmptyListWhenNoCertifications() {
            // given
            given(certificationRepository.findAllByCertificationInformation())
                    .willReturn(Collections.emptyList());

            // when
            List<CertificationDto> result = examService.getCertificationList();

            // then
            assertThat(result).isEmpty();
            verify(certificationRepository).findAllByCertificationInformation();
        }
    }

    @Nested
    @DisplayName("과목 목록 조회 테스트")
    class GetSubjectTest {
        @Test
        @DisplayName("성공: 자격증 ID로 과목 목록을 조회한다")
        void success() {
            // given
            Long certificationId = 1L;
            given(subjectRepository.getSubjectByCertificationId(anyLong()))
                    .willReturn(subjectDtos);

            // when
            List<SubjectDto> result = examService.getSubject(certificationId);

            // then
            assertThat(result).isNotEmpty();
            assertThat(result).hasSize(subjectDtos.size());
            verify(subjectRepository).getSubjectByCertificationId(certificationId);
        }

        @Test
        @DisplayName("실패: 존재하지 않는 자격증 ID로 조회시 빈 리스트를 반환한다")
        void returnEmptyListWhenCertificationNotFound() {
            // given
            Long certificationId = 999L;
            given(subjectRepository.getSubjectByCertificationId(anyLong()))
                    .willReturn(Collections.emptyList());

            // when
            List<SubjectDto> result = examService.getSubject(certificationId);

            // then
            assertThat(result).isEmpty();
            verify(subjectRepository).getSubjectByCertificationId(certificationId);
        }
    }

    @Nested
    @DisplayName("랜덤 문제 목록 조회 테스트")
    class GetRandomQuestionsBySubjectTest {
        @Test
        @DisplayName("성공: 과목 ID로 랜덤 문제 목록을 조회한다")
        void success() {
            // given
            Long subjectId = 1L;
            given(questionRepository.findAllbySubjectIdAndRandomNumber(anyLong()))
                    .willReturn(questionDtos);

            // when
            List<QuestionDto> result = examService.getRandomQuestionsBySubject(subjectId);

            // then
            assertThat(result).isNotEmpty();
            assertThat(result).hasSize(questionDtos.size());
            verify(questionRepository).findAllbySubjectIdAndRandomNumber(subjectId);
        }

        @Test
        @DisplayName("실패: 존재하지 않는 과목 ID로 조회시 빈 리스트를 반환한다")
        void returnEmptyListWhenSubjectNotFound() {
            // given
            Long subjectId = 999L;
            given(questionRepository.findAllbySubjectIdAndRandomNumber(anyLong()))
                    .willReturn(Collections.emptyList());

            // when
            List<QuestionDto> result = examService.getRandomQuestionsBySubject(subjectId);

            // then
            assertThat(result).isEmpty();
            verify(questionRepository).findAllbySubjectIdAndRandomNumber(subjectId);
        }
    }

    @Nested
    @DisplayName("연도별 회차 목록 조회 테스트")
    class GetCertificationYearSessionListTest {
        @Test
        @DisplayName("성공: 자격증 ID로 연도별 회차 목록을 조회한다")
        void success() {
            // given
            Long certificationId = 1L;
            given(certificationRepository.findAllYearAndSessionByCertificationId(anyLong()))
                    .willReturn(certificationTypeDtos);

            // when
            List<CertificationTypeDto> result = examService.getCertificationYearSessionInformationList(certificationId);

            // then
            assertThat(result).isNotEmpty();
            assertThat(result).hasSize(certificationTypeDtos.size());
            verify(certificationRepository).findAllYearAndSessionByCertificationId(certificationId);
        }

        @Test
        @DisplayName("실패: 존재하지 않는 자격증 ID로 조회시 빈 리스트를 반환한다")
        void returnEmptyListWhenCertificationNotFound() {
            // given
            Long certificationId = 999L;
            given(certificationRepository.findAllYearAndSessionByCertificationId(anyLong()))
                    .willReturn(Collections.emptyList());

            // when
            List<CertificationTypeDto> result = examService.getCertificationYearSessionInformationList(certificationId);

            // then
            assertThat(result).isEmpty();
            verify(certificationRepository).findAllYearAndSessionByCertificationId(certificationId);
        }
    }

    @Nested
    @DisplayName("과목별 문제 목록 조회 테스트")
    class GetQuestionsBySubjectAndYearSessionTest {
        @Test
        @DisplayName("성공: 과목 ID, 년도, 회차로 문제 목록을 조회한다")
        void success() {
            // given
            Long subjectId = 1L;
            int year = 2024;
            int session = 1;
            
            given(questionRepository.findAllQuestionBySubjectAndYearSession(anyLong(), anyInt(), anyInt()))
                    .willReturn(questionDtos);

            // when
            List<QuestionDto> result = examService.getQuestionsBySubject(subjectId, year, session);

            // then
            assertThat(result).isNotEmpty();
            assertThat(result).hasSize(questionDtos.size());
            verify(questionRepository).findAllQuestionBySubjectAndYearSession(subjectId, year, session);
        }

        @Test
        @DisplayName("실패: 존재하지 않는 과목 정보로 조회시 빈 리스트를 반환한다")
        void returnEmptyListWhenSubjectNotFound() {
            // given
            Long subjectId = 999L;
            int year = 2024;
            int session = 1;
            
            given(questionRepository.findAllQuestionBySubjectAndYearSession(anyLong(), anyInt(), anyInt()))
                    .willReturn(Collections.emptyList());

            // when
            List<QuestionDto> result = examService.getQuestionsBySubject(subjectId, year, session);

            // then
            assertThat(result).isEmpty();
            verify(questionRepository).findAllQuestionBySubjectAndYearSession(subjectId, year, session);
        }
    }
}