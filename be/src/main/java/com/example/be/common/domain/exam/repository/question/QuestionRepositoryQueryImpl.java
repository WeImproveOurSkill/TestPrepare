package com.example.be.common.domain.exam.repository.question;

import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.exam.entity.QCertificationType;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.example.be.common.domain.exam.entity.QAnswer.answer;
import static com.example.be.common.domain.exam.entity.QCertificationType.certificationType;
import static com.example.be.common.domain.exam.entity.QQuestion.question;
import static com.example.be.common.domain.exam.entity.QSubjectExam.subjectExam;
import static com.example.be.common.domain.middleTable.certificationSubject.entity.QCertificationSubject.certificationSubject;

@RequiredArgsConstructor
public class QuestionRepositoryQueryImpl implements QuestionRepositoryQuery {
    private final JPAQueryFactory jpaQueryFactory;

    // 단건 문제 조회
    @Override
    public QuestionDto findByQuestionBySubjectSizeCount(Long subjectExamId, Long questionId) {
        QuestionDto questionDto = jpaQueryFactory
                .select(Projections.constructor(
                        QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("content"),
                        answer.answerText.as("answer"),
                        answer.explanation))
                .from(subjectExam)
                .leftJoin(subjectExam.questions, question)
                .leftJoin(question.answer, answer)
                .where(
                        subjectExam.id.eq(subjectExamId),
                        question.id.eq(questionId))
                .fetchOne();
        return questionDto;
    }

    // 랜덤 5문제 조회
    @Override
    public List<QuestionDto> findAllbySubjectIdAndRandomNumber(Long subjectExamId) {
        List<QuestionDto> questionDtos = jpaQueryFactory.select(Projections.constructor(QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("content"),
                        answer.answerText.as("answer"),
                        answer.explanation))
                .from(subjectExam)
                .leftJoin(subjectExam.questions, question)
                .leftJoin(question.answer, answer)
                .where(
                        subjectExam.id.eq(subjectExamId))
                .orderBy(question.randomKey.asc()).limit(5).fetch();

        return questionDtos;
    }
    // 과목 시험모드 문제 조회
    @Override
    public List<QuestionDto> findAllQuestionBySubjectAndYearSession(Long subjectId, int year, int session) {
        return jpaQueryFactory.select(Projections.constructor(
                        QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("content"),
                        answer.answerText.as("answer"),
                        answer.explanation)).from(question)
                .leftJoin(question.answer, answer)
                .leftJoin(question.subjectExam, subjectExam)
                .leftJoin(subjectExam.certificationSubjects, certificationSubject)
                .leftJoin(certificationSubject.certificationType,certificationType)
                .where(certificationType.year.eq(year),
                        certificationType.session.eq(session))
                .limit(20).fetch();
//        return null;

    }


}
