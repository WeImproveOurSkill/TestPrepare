package com.example.questionsserver.service;

import com.example.questionsserver.dtos.CertificationDto;
import com.example.questionsserver.dtos.CertificationTypeDto;
import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.dtos.SubjectDto;

import java.util.List;

public interface ExamService {
    List<CertificationDto> getCertificationList();

    List<CertificationTypeDto> getCertificationYearSessionInformationList(Long certificationId);

    List<SubjectDto> getSubject(Long certificationId);

    QuestionDto getQuestionsBySubject(Long subjectId, Long questionId);

    List<QuestionDto> getRandomQuestionsBySubject(Long subjectId);

    List<QuestionDto> getQuestionsBySubject(Long subjectId, int year, int session);
}
