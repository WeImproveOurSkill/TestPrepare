package com.example.be.common.domain.exam.repository.subject;

import com.example.be.common.domain.exam.dtos.SubjectDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.example.be.common.domain.exam.entity.QSubjectExam.subjectExam;


@RequiredArgsConstructor
public class SubjectRepositoryQueryImpl implements SubjectRepositoryQuery {
    private final JPAQueryFactory jpaQueryFactory;
    @Override
    public List<SubjectDto> getSubjectByCertificationId(Long certificationId) {
        return jpaQueryFactory.select(Projections.constructor(
                SubjectDto.class,
                        subjectExam.id,
                        subjectExam.name
        )).from(subjectExam)
                .where(subjectExam.certification.id.eq(certificationId)).fetch();
//        return null;

    }

}
