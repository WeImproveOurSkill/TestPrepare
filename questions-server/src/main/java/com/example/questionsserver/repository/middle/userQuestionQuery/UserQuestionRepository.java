package com.example.questionsserver.repository.middle.userQuestionQuery;

import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.entity.Question;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserQuestionRepository extends JpaRepository<UserQuestion, Long>, UserQuestionRepositoryQuery {
    UserQuestion findByUserAndQuestion(String attr0, Question question);

    boolean existsByUserAndQuestion(String attr0, Question question);

}
