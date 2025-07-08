package com.example.questionsserver.repository.middle.userQuestion;

import com.example.questionsserver.entity.Question;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserQuestionRepository extends JpaRepository<UserQuestion, Long>, UserQuestionRepositoryQuery {
    UserQuestion findByUserNameAndQuestion(String userName, Question question);

    boolean existsByUserNameAndQuestion(String userName, Question question);

}
