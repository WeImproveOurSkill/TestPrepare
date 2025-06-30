package com.example.questionsserver.service.middleTable;

import com.example.questionsserver.dtos.AnswerRecordDto;
import com.example.questionsserver.dtos.AnswerSubmitDTO;
import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.entity.Question;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import com.example.questionsserver.repository.main.question.QuestionRepository;
import com.example.questionsserver.repository.middle.userQuestionQuery.UserQuestionRepository;
import com.example.questionsserver.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserQuestionServiceImpl implements UserQuestionService {

    private final QuestionRepository questionRepository;

    private final UserQuestionRepository userQuestionRepository;
    private final ExamService examService;

    @Override
    @Transactional // 시험 문제 풀이 처리 서비스 코드
    public void testCheckAnswers(String username, List<AnswerSubmitDTO> answers) {
        List<UserQuestion> list = new ArrayList<>();
        for (AnswerSubmitDTO answer : answers) {
            Question question = examService.findById(answer.questionId());
            UserQuestion.Status status = getStatus(answer);
            UserQuestion userQuestion = findOrCreateUserQuestionByStatus(username, question, status);
            list.add(userQuestion);
        }
        userQuestionRepository.saveAll(list);
    }

    private UserQuestion findOrCreateUserQuestionByStatus(String username, Question question, UserQuestion.Status status) {
        UserQuestion userQuestion;
        userQuestion = userQuestionRepository.findByUserAndQuestion(username, question);
        if (userQuestion == null) {
            userQuestion = UserQuestion.builder()
                    .question(question)
                    .userName(username)
                    .solveTime(LocalDateTime.now())
                    .isBookmarked(false)
                    .status(status)
                    .build();
        } else {
            userQuestion.updateRecord(status);
        }

        return userQuestion;
    }

    private static UserQuestion.Status getStatus(AnswerSubmitDTO submitAnswer) {
        UserQuestion.Status status;

        if (submitAnswer.answer().equals(submitAnswer.userAnswer())) {
            status = UserQuestion.Status.CORRECT;
        } else {
            status = UserQuestion.Status.WRONG;
        }
        return status;
    }

    @Override
    @Transactional
    public void studyCheckAnswer(String username, AnswerRecordDto answer) {
        Question question = examService.findById(answer.questionId());

        UserQuestion userQuestion = findOrCreateUserQuestionByStatus(username, question, answer.status());
        userQuestionRepository.save(userQuestion);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "userBookmarks", key = "#username.id + '_*'"),
            @CacheEvict(value = "userWrongQuestions", key = "#username.id + '_*'")
    })
    public void updateBookMark(String username, Long questionId) {
        Question byId = examService.findById(questionId);

        if (userQuestionRepository.existsByUserAndQuestion(username, byId)) {
            UserQuestion byUserAndQuestion = userQuestionRepository.findByUserAndQuestion(username, byId);
            byUserAndQuestion.updateBookmark();
        } else {
            UserQuestion userQuestion = UserQuestion.builder()
                    .isBookmarked(true)
                    .question(byId)
                    .userName(username)
                    .solveTime(LocalDateTime.now())
                    .status(UserQuestion.Status.WRONG)
                    .build();
            userQuestionRepository.save(userQuestion);
        }
    }

    @Override
    @Transactional()
    @Cacheable(value = "userBookmarks", key = "#username + '_' + #certificationId")
    public List<QuestionDto> getBookMarkQuestion(String username, Long certificationId) {
        return userQuestionRepository.getBookMarkQuestion(username, certificationId);
    }


    @Transactional()
    @Cacheable(value = "userWrongQuestions", key = "#username + '_' + #status")
    @Override
    public List<QuestionDto> getWrongQuestions(String username, UserQuestion.Status status) {
        return userQuestionRepository.findAllAboutWrongQuestionByStatus(username, status);
    }
}
