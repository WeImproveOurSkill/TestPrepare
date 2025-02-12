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
    @Transactional // 시험 문제 풀이 처리 서비스 코드
    public void processAnswers(User user, List<AnswerSubmitDTO> answers) {
        List<UserQuestion> list = new ArrayList<>();
        for (AnswerSubmitDTO answer : answers) {
            Question question = questionService.findById(answer.getQuestionId());
            UserQuestion.Status status = getStatus(answer);
            UserQuestion userQuestion = getUserQuestion(user, question, status);
            list.add(userQuestion);
        }
        userQuestionRepository.saveAll(list);
    }

    private static UserQuestion getUserQuestion(User user, Question question, UserQuestion.Status status) {
        UserQuestion userQuestion = UserQuestion.builder()
                .question(question)
                .user(user)
                .solveTime(LocalDateTime.now())
                .isBookmarked(false)
                .status(status)
                .build();
        return userQuestion;
    }

    private static UserQuestion.Status getStatus(AnswerSubmitDTO answer) {
        UserQuestion.Status status;

        if (answer.getAnswer().equals(answer.getUserAnswer())) {
            status = UserQuestion.Status.CORRECT;
        } else if (answer.getUserAnswer().isEmpty()) {
            status = UserQuestion.Status.UNANSWERED;
        } else {
            status = UserQuestion.Status.WRONG;
        }
        return status;
    }

    @Override
    @Transactional
    public void recordSolveQuestion(User user, AnswerRecordDto answer) {
        Question question = questionService.findById(answer.getQuestionId());

        UserQuestion userQuestion = getUserQuestion(user, answer, question);
        userQuestionRepository.save(userQuestion);
    }

    @Override
    @Transactional
    public void updateBookMark(User user, Long questionId) {
        Question byId = questionService.findById(questionId);

        if(userQuestionRepository.existsByUserAndQuestion(user, byId)){
            UserQuestion byUserAndQuestion = userQuestionRepository.findByUserAndQuestion(user, byId);
            byUserAndQuestion.updateBookmark();
        }else{
            UserQuestion userQuestion = UserQuestion.builder()
                    .isBookmarked(true)
                    .question(byId)
                    .user(user)
                    .solveTime(LocalDateTime.now())
                    .status(UserQuestion.Status.UNANSWERED)
                    .build();
            userQuestionRepository.save(userQuestion);
        }
    }

    @Override
    public List<QuestionDto> getBookMarkQuestion(User user, Long certificationId) {
        return userQuestionRepository.getBookMarkQuestion(user, certificationId);
    }

    private static UserQuestion getUserQuestion(User user, AnswerRecordDto answer, Question question) {
        UserQuestion userQuestion = UserQuestion.builder()
                .user(user)
                .question(question)
                .status(answer.getStatus())
                .solveTime(LocalDateTime.now())
                .isBookmarked(false)
                .build();
        return userQuestion;
    }

    @Override
    public List<QuestionDto> getWrongQuestions(User user, UserQuestion.Status status) {
        return userQuestionRepository.findAllAboutWrongQuestionByStatus(user, status);
    }
}
