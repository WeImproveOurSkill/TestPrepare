package com.example.be.common.domain.middleTable.userQuestion.repository;

import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import com.example.be.common.domain.user.entity.User;

import java.util.List;

public interface UserQuestionRepositoryQuery {
    List<QuestionDto> findAllAboutWrongQuestionByStatus(User attr0, UserQuestion.Status status);

}
