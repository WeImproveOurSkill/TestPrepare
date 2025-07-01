package com.example.questionsserver.repository.main.question;

import com.example.questionsserver.dtos.QuestionDto;

import java.util.List;

public interface QuestionRepositoryQuery {
    // 단건 문제 조회
    QuestionDto findByQuestionBySubjectSizeCount(Long subjectExamId, Long questionId);

    List<QuestionDto> findAllbySubjectIdAndRandomNumber(Long subjectId);

    // 과목 시험모드 문제 조회
    List<QuestionDto> findAllQuestionBySubjectAndYearSession(Long subjectId, int year, int session);
}
