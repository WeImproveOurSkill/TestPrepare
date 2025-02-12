package com.example.be.common.domain.exam.repository.question;

import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.example.be.common.domain.exam.entity.QAnswer.answer;
import static com.example.be.common.domain.exam.entity.QQuestion.question;
import static com.example.be.common.domain.exam.entity.QSubjectExam.subjectExam;

@RequiredArgsConstructor
public class QuestionRepositoryQueryImpl implements QuestionRepositoryQuery {
    private final JPAQueryFactory jpaQueryFactory;


    @Override
    public QuestionDto findByQuestionBySubjectSizeCount(Long subjectId, Long questionId) {
        QuestionDto questionDto = (QuestionDto) jpaQueryFactory.select(Projections.constructor(
                        QuestionDto.class,
                        question.id.as("questionId"),
                        question.questionContent.as("question"),
                        question.questionType,
                        question.choices,
                        answer.answerText.as("answer"),
                        answer.explanation))
                .from(subjectExam)
                .leftJoin(subjectExam.questions, question)
                .leftJoin(question.answer, answer)
                .where(subjectExam.id.eq(subjectId), question.id.eq(questionId+1))
                .fetch();
        return questionDto;


    }
}
