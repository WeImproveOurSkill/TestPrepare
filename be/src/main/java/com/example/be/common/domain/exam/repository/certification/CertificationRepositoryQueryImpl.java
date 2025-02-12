package com.example.be.common.domain.exam.repository.certification;

import com.example.be.common.domain.exam.dtos.CertificationDto;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.exam.entity.Certification;
import com.example.be.common.domain.exam.entity.QAnswer;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.spel.ast.Projection;

import java.util.ArrayList;
import java.util.List;

import static com.example.be.common.domain.exam.entity.QAnswer.answer;
import static com.example.be.common.domain.exam.entity.QSubjectExam.subjectExam;
import static com.example.be.common.domain.exam.entity.QCertification.certification;
import static com.example.be.common.domain.exam.entity.QQuestion.question;


@RequiredArgsConstructor
public class CertificationRepositoryQueryImpl implements CertificationRepositoryQuery {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<QuestionDto> findAllQuestionByNameAndYearAndSession(String name, int year, String session) {
        List<QuestionDto> questionDtos = jpaQueryFactory.select(Projections.constructor(
                QuestionDto.class,
                question.id.as("questionId"),
                question.questionContent.as("question"),
                question.questionType,
                question.choices,
                answer.answerText.as("answer"),
                answer.explanation
        )).from(certification)
                .leftJoin(certification.subjectExams, subjectExam)
                .leftJoin(subjectExam.questions, question)
                .leftJoin(question.answer,answer)
                .where(certification.name.eq(name),
                        certification.year.eq(year),
                        certification.session.eq(session))
                .orderBy(subjectExam.id.asc(),question.id.asc())
                .fetch();

//        List<QuestionDto> questionDtos = new ArrayList<>();
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
}
