package com.example.be.common.domain.middleTable.userQuestion.repository;

import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import com.example.be.common.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserQuestionRepository extends JpaRepository<UserQuestion, Long>,UserQuestionRepositoryQuery {
}
