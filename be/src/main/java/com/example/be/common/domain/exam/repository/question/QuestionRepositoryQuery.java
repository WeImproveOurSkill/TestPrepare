package com.example.be.common.domain.exam.repository.question;

import com.example.be.common.domain.exam.dtos.QuestionDto;

public interface QuestionRepositoryQuery {
    QuestionDto findByQuestionBySubjectSizeCount(Long subjectId, Long questionId, int problemCount);
}
