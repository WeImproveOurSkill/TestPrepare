package com.example.questionsserver.service;

import com.example.questionsserver.dtos.CertificationDto;
import com.example.questionsserver.dtos.CertificationTypeDto;
import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.dtos.SubjectDto;
import com.example.questionsserver.entity.Question;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ExamService {
    List<CertificationDto> getCertificationList();

    List<CertificationTypeDto> getCertificationYearSessionInformationList(Long certificationId);

    List<SubjectDto> getSubject(Long certificationId);

    @Transactional(readOnly = true)
    List<QuestionDto> getQuestionsByCertification(String name, int year, int session);

    QuestionDto getQuestionsBySubject(Long subjectId, Long questionId);

    List<QuestionDto> getRandomQuestionsBySubject(Long subjectId);

    List<QuestionDto> getQuestionsBySubject(Long subjectId, int year, int session);

    Question findById(Long questionId);
}
