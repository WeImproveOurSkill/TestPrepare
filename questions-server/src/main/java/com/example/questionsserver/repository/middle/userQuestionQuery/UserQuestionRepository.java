package com.example.questionsserver.repository.middle.userQuestionQuery;

import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.entity.Question;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserQuestionRepository extends JpaRepository<UserQuestion, Long>, UserQuestionRepositoryQuery {
    UserQuestion findByUserNameAndQuestion(String userName, Question question);

    boolean existsByUserNameAndQuestion(String userName, Question question);

}
