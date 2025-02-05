package com.example.be.common.domain.exam.repository.question;

import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.exam.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long>, QuestionRepositoryQuery {
}
