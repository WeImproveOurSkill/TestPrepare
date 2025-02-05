package com.example.be.common.domain.middleTable.userQuestion.service;

import com.example.be.common.domain.exam.dtos.AnswerSubmitDTO;
import com.example.be.common.domain.exam.dtos.ExamResultDTO;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import com.example.be.common.domain.middleTable.userQuestion.repository.UserQuestionRepository;
import com.example.be.common.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserQuestionServiceImpl implements UserQuestionService {

    private final UserQuestionRepository userQuestionRepository;

    @Override
    public ExamResultDTO processAnswers(User user, List<AnswerSubmitDTO> answers) {


        return null;
    }

    @Override
    public List<QuestionDto> getWrongQuestions(User user, UserQuestion.Status status) {
        return userQuestionRepository.findAllAboutWrongQuestionByStatus(user, status);
    }
}
