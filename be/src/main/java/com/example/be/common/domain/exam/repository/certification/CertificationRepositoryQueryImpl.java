package com.example.be.common.domain.exam.repository.certification;

import com.example.be.common.domain.exam.dtos.CertificationDto;
import com.example.be.common.domain.exam.dtos.CertificationTypeDto;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.exam.entity.Certification;
import com.example.be.common.domain.exam.entity.CertificationType;
import com.example.be.common.domain.exam.entity.QAnswer;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.spel.ast.Projection;

import java.util.ArrayList;
import java.util.List;

import static com.example.be.common.domain.exam.entity.QAnswer.answer;
import static com.example.be.common.domain.exam.entity.QCertificationType.certificationType;
import static com.example.be.common.domain.exam.entity.QSubjectExam.subjectExam;
import static com.example.be.common.domain.exam.entity.QCertification.certification;
import static com.example.be.common.domain.exam.entity.QQuestion.question;


@RequiredArgsConstructor
public class CertificationRepositoryQueryImpl implements CertificationRepositoryQuery {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<QuestionDto> findAllQuestionByNameAndYearAndSession(String name, int year, int session) {
        //1 certification -> question
        List<QuestionDto> questionDtos = jpaQueryFactory.select(Projections.constructor(
                        QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("question"),

                        answer.answerText.as("answer"),
                        answer.explanation
                )).from(certification)
                .join(certification.certificationTypes, certificationType)
                .join(certification.subjectExams, subjectExam)
                .join(subjectExam.questions, question)
                .join(question.answer, answer)
                .where(certificationType.year.eq(year)
                        , certificationType.session.eq(session)
                        , certification.name.eq(name)
                ).fetch();

        //2 question -> certification
//        List<QuestionDto> questionDtos = jpaQueryFactory.select(Projections.constructor(
//                        QuestionDto.class,
//                        question.id.as("questionId"),
//                        question.content.as("question"),
//
//                        answer.answerText.as("answer"),
//                        answer.explanation
//                )).from(question)
//                .leftJoin(question.answer, answer)
//                .rightJoin(question.subjectExam, subjectExam)
//                .rightJoin(subjectExam.certification, certification)
//                .rightJoin(certification.certificationTypes, certificationType)
//                .where(
//                        certificationType.year.eq(year)
//                        , certificationType.session.eq(session)
//                        , certification.name.eq(name)
//                ).fetch();


        return questionDtos;
//        return null;

    }

    @Override
    public List<CertificationDto> findAllByCertificationInformation() {
        return jpaQueryFactory.select(Projections.constructor(
                CertificationDto.class,
                certification.id,
                certification.name))
                .from(certification)
                .fetch();


//        return null;
    }

    @Override
    public List<CertificationTypeDto> findAllYearAndSessionByCertificationId(Long certificationId) {
        return jpaQueryFactory.select(Projections.constructor(
                        CertificationTypeDto.class,
                        certificationType.year,
                        certificationType.session
                )).from(certificationType).
                join(certification.certificationTypes, certificationType)
                .where(certification.id.eq(certificationId)).fetch();
    }
}
