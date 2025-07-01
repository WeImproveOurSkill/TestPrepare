package com.example.questionsserver.repository.main.subjectExam;

import com.example.questionsserver.dtos.SubjectDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.example.questionsserver.entity.QSubjectExam.subjectExam;

@RequiredArgsConstructor
public class SubjectExamRepositoryQueryImpl implements SubjectExamRepositoryQuery {

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
