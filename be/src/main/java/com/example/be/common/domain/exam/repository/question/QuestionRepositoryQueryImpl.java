package com.example.be.common.domain.exam.repository.question;

import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.example.be.common.domain.exam.entity.QAnswer.answer;
import static com.example.be.common.domain.exam.entity.QQuestion.question;
import static com.example.be.common.domain.exam.entity.QSubjectExam.subjectExam;

@RequiredArgsConstructor
public class QuestionRepositoryQueryImpl implements QuestionRepositoryQuery {
    private final JPAQueryFactory jpaQueryFactory;

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
                        question.id.eq(questionId + 1))
                .fetchOne();
        return questionDto;
    }

    @Override
    public List<QuestionDto> findAllbySubjectIdAndRandomNumber(Long subjectExamId, Integer integer) {
        List<QuestionDto> questionDtos = jpaQueryFactory.select(Projections.constructor(QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("content"),
                        answer.answerText.as("answer"),
                        answer.explanation))
                .from(subjectExam)
                .leftJoin(subjectExam.questions, question)
                .leftJoin(question.answer, answer)
                .where(
                        subjectExam.id.eq(subjectExamId),
                        question.id.mod(Long.valueOf(integer)).eq(1L)).limit(20).fetch();

        return questionDtos;
    }


}
