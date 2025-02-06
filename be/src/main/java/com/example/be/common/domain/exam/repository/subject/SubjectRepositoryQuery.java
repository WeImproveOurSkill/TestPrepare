package com.example.be.common.domain.exam.repository.subject;

import com.example.be.common.domain.exam.dtos.SubjectDto;

import java.util.List;

public interface SubjectRepositoryQuery {
    List<SubjectDto> getSubjectByCertificationId(Long certificationId);

}
