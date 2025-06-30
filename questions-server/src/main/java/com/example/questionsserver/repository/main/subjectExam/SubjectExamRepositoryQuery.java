package com.example.questionsserver.repository.main.subjectExam;

import com.example.questionsserver.dtos.SubjectDto;

import java.util.List;

public interface SubjectExamRepositoryQuery {
    List<SubjectDto> getSubjectByCertificationId(Long certificationId);
}
