package com.example.questionsserver.service.middleTable;

import com.example.questionsserver.dtos.AnswerRecordDto;
import com.example.questionsserver.dtos.AnswerSubmitDTO;
import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserQuestionServiceImpl implements UserQuestionService {

    @Override
    public void testCheckAnswers(String userId, List<AnswerSubmitDTO> answers) {

    }

    @Override
    public void studyCheckAnswer(String username, AnswerRecordDto answer) {

    }

    @Override
    public List<QuestionDto> getWrongQuestions(String username, UserQuestion.Status status) {
        return List.of();
    }

    @Override
    public void updateBookMark(String username, Long questionId) {

    }

    @Override
    public List<QuestionDto> getBookMarkQuestion(String username, Long certificationId) {
        return List.of();
    }
}
