package com.example.questionsserver.service.middleTable;

import com.example.questionsserver.dtos.AnswerRecordDto;
import com.example.questionsserver.dtos.AnswerSubmitDTO;
import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.entity.middleTable.UserQuestion;

import java.util.List;

public interface UserQuestionService {
    void testCheckAnswers(String userId, List<AnswerSubmitDTO> answers);

    void studyCheckAnswer(String username, AnswerRecordDto answer);

    List<QuestionDto> getWrongQuestions(String username, UserQuestion.Status status);

    void updateBookMark(String username, Long questionId);

    List<QuestionDto> getBookMarkQuestion(String username, Long certificationId);
}
