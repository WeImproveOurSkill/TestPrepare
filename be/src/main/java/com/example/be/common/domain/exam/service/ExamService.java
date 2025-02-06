package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.dtos.SubjectDto;
import com.example.be.common.domain.exam.dtos.CertificationDto;
import com.example.be.common.domain.exam.dtos.QuestionDto;

import java.util.List;

public interface ExamService {
    List<QuestionDto> getQuestionsByCertification(String name, int year, String session);

    QuestionDto getRandomQuestionsBySubject(Long subjectId, Long questionId);


    List<CertificationDto> getCertificationList();

    List<SubjectDto> getSubject(Long certificationId);
}
