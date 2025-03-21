package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.dtos.CertificationTypeDto;
import com.example.be.common.domain.exam.dtos.SubjectDto;
import com.example.be.common.domain.exam.dtos.CertificationDto;
import com.example.be.common.domain.exam.dtos.QuestionDto;

import java.util.List;

public interface ExamService {
    List<QuestionDto> getQuestionsByCertification(String name, int year, int session);

    QuestionDto getQuestionsBySubject(Long subjectId, Long questionId);


    List<CertificationDto> getCertificationList();

    List<SubjectDto> getSubject(Long certificationId);

    List<QuestionDto> getRandomQuestionsBySubject(Long subjectId);

    List<CertificationTypeDto> getCertificationYearSessionList(Long certificationId);

    List<QuestionDto> getQuestionsBySubject(Long subjectId, int year, int session);
}
