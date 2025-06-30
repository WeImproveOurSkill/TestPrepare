package com.example.questionsserver.repository.main.certification;

import com.example.questionsserver.dtos.CertificationDto;
import com.example.questionsserver.dtos.CertificationTypeDto;
import com.example.questionsserver.dtos.QuestionDto;

import java.util.List;

public interface CertificationRepositoryQuery {

    List<QuestionDto> findAllQuestionByNameAndYearAndSession(String name, int year, int year1);

    List<CertificationDto> findAllByCertificationInformation();

    List<CertificationTypeDto> findAllYearAndSessionByCertificationId(Long certificationId);
}
