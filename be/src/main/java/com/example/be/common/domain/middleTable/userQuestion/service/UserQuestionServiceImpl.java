package com.example.be.common.domain.middleTable.userQuestion.service;

import com.example.be.common.domain.exam.dtos.AnswerRecordDto;
import com.example.be.common.domain.exam.dtos.AnswerSubmitDTO;
import com.example.be.common.domain.exam.dtos.ExamResultDTO;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.exam.entity.Question;
import com.example.be.common.domain.exam.service.QuestionService;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import com.example.be.common.domain.middleTable.userQuestion.repository.UserQuestionRepository;
import com.example.be.common.domain.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserQuestionServiceImpl implements UserQuestionService {

    private final UserQuestionRepository userQuestionRepository;
    private final QuestionService questionService;

    @Override
    @Transactional
    public void processAnswers(User user, List<AnswerSubmitDTO> answers) {
        List<UserQuestion> list = new ArrayList<>();
        for(AnswerSubmitDTO answer : answers) {
            Question question = questionService.findById(answer.getQuestionId());
            UserQuestion.Status status = answer.getAnswer().equals(answer.getUserAnswer())
                    ? UserQuestion.Status.CORRECT
                    : answer.getUserAnswer().isEmpty() ? UserQuestion.Status.UNANSWERED : UserQuestion.Status.WRONG;

            UserQuestion userQuestion = UserQuestion.builder()
                    .question(question)
                    .user(user)
                    .solveTime(LocalDateTime.now())
                    .isRequest(false)
                    .isBookmarked(false)
                    .status(status)
                    .build();
            list.add(userQuestion);
        }
        userQuestionRepository.saveAll(list);
    }

    @Override
    @Transactional
    public void recordSolveQuestion(User user, AnswerRecordDto answer) {
        Question question = questionService.findById(answer.getQuestionId());

        UserQuestion userQuestion = getUserQuestion(user, answer, question);
        userQuestionRepository.save(userQuestion);
    }

    private static UserQuestion getUserQuestion(User user, AnswerRecordDto answer, Question question) {
        UserQuestion userQuestion = UserQuestion.builder()
                .user(user)
                .question(question)
                .status(answer.getStatus())
                .solveTime(LocalDateTime.now())
                .isBookmarked(false)
                .isRequest(false)
                .build();
        return userQuestion;
    }

    @Override
    public List<QuestionDto> getWrongQuestions(User user, UserQuestion.Status status) {
        return userQuestionRepository.findAllAboutWrongQuestionByStatus(user, status);
    }
}
