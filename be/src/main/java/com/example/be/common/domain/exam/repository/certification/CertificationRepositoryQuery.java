package com.example.be.common.domain.exam.repository.certification;

import com.example.be.common.domain.exam.dtos.CertificationDto;
import com.example.be.common.domain.exam.dtos.QuestionDto;

import java.util.List;

public interface CertificationRepositoryQuery {

    List<QuestionDto> findAllQuestionByNameAndYearAndSession(String name, int year, String session);
    List<CertificationDto> findAllByCertificationInformation();

}

