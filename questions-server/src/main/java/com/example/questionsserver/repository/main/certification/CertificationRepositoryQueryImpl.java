package com.example.questionsserver.repository.main.certification;

import com.example.questionsserver.dtos.CertificationDto;
import com.example.questionsserver.dtos.CertificationTypeDto;
import com.example.questionsserver.dtos.QuestionDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.example.questionsserver.entity.QCertification.certification;
import static com.example.questionsserver.entity.QCertificationType.certificationType;
import static com.example.questionsserver.entity.QSubjectExam.subjectExam;
import static com.example.questionsserver.entity.QQuestion.question;
import static com.example.questionsserver.entity.QAnswer.answer;



import java.util.List;

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

        return questionDtos;

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
                )).from(certificationType)
                .where(certificationType.certification.id.eq(certificationId))
                .orderBy(certificationType.year.desc(), certificationType.session.desc())
                .fetch();
    }
}
