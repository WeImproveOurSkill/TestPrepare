package com.example.questionsserver.repository.main.question;

import com.example.questionsserver.dtos.QuestionDto;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.example.questionsserver.entity.QAnswer.answer;
import static com.example.questionsserver.entity.QCertificationType.certificationType;
import static com.example.questionsserver.entity.QQuestion.question;
import static com.example.questionsserver.entity.QSubjectExam.subjectExam;

@RequiredArgsConstructor
public abstract class QuestionRepositoryQueryImpl implements QuestionRepositoryQuery{

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
        // // 방법 3: ID 범위를 사용한 랜덤 선택
        // List<Long> questionIds = jpaQueryFactory
        //         .select(question.id)
        //         .from(subjectExam)
        //         .leftJoin(subjectExam.questions, question)
        //         .where(subjectExam.id.eq(subjectExamId))
        //         .fetch();

        // if (questionIds.isEmpty()) {
        //     return new ArrayList<>();
        // }

        // // 랜덤하게 5개의 ID 선택
        // Collections.shuffle(questionIds);
        // List<Long> selectedIds = questionIds.subList(0, Math.min(5, questionIds.size()));

        // return jpaQueryFactory
        //         .select(Projections.constructor(QuestionDto.class,
        //                 question.id.as("questionId"),
        //                 question.content.as("content"),
        //                 answer.answerText.as("answer"),
        //                 answer.explanation))
        //         .from(subjectExam)
        //         .leftJoin(subjectExam.questions, question)
        //         .leftJoin(question.answer, answer)
        //         .where(subjectExam.id.eq(subjectExamId)
        //                 .and(question.id.in(selectedIds)))
        //         .fetch();
        return jpaQueryFactory
                .select(Projections.constructor(QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("content"),
                        answer.answerText.as("answer"),
                        answer.explanation))
                .from(question)
                .innerJoin(question.answer, answer)
                .where(question.subjectExam.id.eq(subjectExamId))
                .orderBy(Expressions.numberTemplate(Double.class, "RAND()").asc())
                .limit(5)
                .fetch();
    }


    // 과목 시험모드 문제 조회
    @Override
    public List<QuestionDto> findAllQuestionBySubjectAndYearSession(Long subjectId, int year, int session) {
        // 중간 테이블(CertificationSubject)을 조인에 추가
        // 1단계: 조건에 맞는 문제 ID만 조회
        return jpaQueryFactory.select(Projections.constructor(QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("content"),
                        answer.answerText.as("answer"),
                        answer.explanation))
                .from(question)
                .innerJoin(question.answer, answer)
                .leftJoin(question.subjectExam, subjectExam)
                .leftJoin(question.certificationType, certificationType)
                .where(
                        certificationType.year.eq(year),
                        certificationType.session.eq(session),
                        question.subjectExam.id.eq(subjectId)
                ).limit(20).fetch();
    }

}
