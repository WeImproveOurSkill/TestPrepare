package com.example.questionsserver.repository.middle;

import com.example.questionsserver.entity.middleTable.UserQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserQuestionRepository extends JpaRepository<UserQuestion, Long> {
}
