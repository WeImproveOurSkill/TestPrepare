package com.example.be.common.domain.middleTable.userQuestion.service;

import com.example.be.common.domain.exam.dtos.AnswerRecordDto;
import com.example.be.common.domain.exam.dtos.AnswerSubmitDTO;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import com.example.be.common.domain.user.entity.User;

import java.util.List;

public interface UserQuestionService {
    List<QuestionDto> getWrongQuestions(User user, UserQuestion.Status status);

    void processAnswers(User user, List<AnswerSubmitDTO> answers);

    void recordSolveQuestion(User user, AnswerRecordDto answer);

    void updateBookMark(User user, Long questionId);

    List<QuestionDto> getBookMarkQuestion(User user, Long certificationId);
}
