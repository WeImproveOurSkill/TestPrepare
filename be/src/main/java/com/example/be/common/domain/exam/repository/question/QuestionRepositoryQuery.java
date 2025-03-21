package com.example.be.common.domain.exam.repository.question;

import com.example.be.common.domain.exam.dtos.QuestionDto;

import java.util.List;

public interface QuestionRepositoryQuery {
    QuestionDto findByQuestionBySubjectSizeCount(Long subjectId, Long questionId);

    List<QuestionDto> findAllbySubjectIdAndRandomNumber(Long subjectId);

    List<QuestionDto> findAllQuestionBySubjectAndYearSession(Long subjectId, int year, int session);
}
