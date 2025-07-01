package com.example.questionsserver.repository.main.answer;

import com.example.questionsserver.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepository extends JpaRepository<Answer,Long > {
}
