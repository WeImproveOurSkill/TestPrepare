package com.example.questionsserver.repository.middle.userQuestionQuery;

import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.entity.middleTable.UserQuestion;

import java.util.List;

public interface UserQuestionRepositoryQuery {
    List<QuestionDto> findAllAboutWrongQuestionByStatus(String username, UserQuestion.Status status);

    List<QuestionDto> getBookMarkQuestion(String username, Long certificationId);
}
