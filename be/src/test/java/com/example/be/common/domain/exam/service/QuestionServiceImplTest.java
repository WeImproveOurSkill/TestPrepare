package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.entity.Question;
import com.example.be.common.domain.exam.repository.question.QuestionRepository;
import com.example.be.common.domain.fixture.ExamFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuestionServiceImpl questionService;

    @Nested
    @DisplayName("문제 조회 테스트")
    class FindByIdTest {
        @Test
        @DisplayName("성공: ID로 문제를 조회한다")
        void success() {
            // given
            Long questionId = 1L;
            Question question = ExamFixture.createQuestion();
            given(questionRepository.findById(anyLong()))
                    .willReturn(Optional.of(question));

            // when
            Question result = questionService.findById(questionId);

            // then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).isEqualTo(question.getContent());
            verify(questionRepository).findById(questionId);
        }

        @Test
        @DisplayName("실패: 존재하지 않는 ID로 조회시 예외가 발생한다")
        void throwExceptionWhenQuestionNotFound() {
            // given
            Long questionId = 999L;
            given(questionRepository.findById(anyLong()))
                    .willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> questionService.findById(questionId))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("해당 문제는 존재하지 않습니다.");
            verify(questionRepository).findById(questionId);
        }
    }
}