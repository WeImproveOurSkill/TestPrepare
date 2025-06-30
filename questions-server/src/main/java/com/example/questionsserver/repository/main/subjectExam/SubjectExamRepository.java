package com.example.questionsserver.repository.main.subjectExam;

import com.example.questionsserver.dtos.SubjectDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectExamRepository extends JpaRepository<SubjectExamRepository, Long>, SubjectExamRepositoryQuery {

}
