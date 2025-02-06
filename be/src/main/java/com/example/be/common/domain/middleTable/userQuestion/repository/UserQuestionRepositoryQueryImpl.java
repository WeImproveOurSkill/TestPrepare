package com.example.be.common.domain.middleTable.userQuestion.repository;

import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.middleTable.userQuestion.entity.QUserQuestion;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import com.example.be.common.domain.user.entity.User;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.spel.ast.Projection;

import java.util.List;

import static com.example.be.common.domain.exam.entity.QAnswer.answer;
import static com.example.be.common.domain.exam.entity.QCertification.certification;
import static com.example.be.common.domain.exam.entity.QQuestion.question;
import static com.example.be.common.domain.exam.entity.QSubject.subject;
import static com.example.be.common.domain.middleTable.userQuestion.entity.QUserQuestion.userQuestion;

@RequiredArgsConstructor
public class UserQuestionRepositoryQueryImpl implements UserQuestionRepositoryQuery {
    private final JPAQueryFactory jpaQueryFactory;


    @Override
    public List<QuestionDto> findAllAboutWrongQuestionByStatus(User user, UserQuestion.Status status) {
        return jpaQueryFactory.select(Projections.constructor(
                        QuestionDto.class,
                        question.id.as("questionId"),
                        question.questionContent.as("question"),
                        question.questionType,
                        question.choices,
                        answer.answerText.as("answer"),
                        answer.explanation
                )).from(userQuestion)
                .leftJoin(userQuestion.question, question)
                .leftJoin(question.answer, answer)
                .where(userQuestion.status.eq(status),
                        userQuestion.user.id.eq(user.getId()))
                .fetch();
    }

    @Override
    public List<QuestionDto> getBookMarkQuestion(User user, Long certificationId) {
        return jpaQueryFactory.select(Projections.constructor(
                        QuestionDto.class,
                        question.id.as("questionId"),
                        question.questionContent.as("question"),
                        question.questionType,
                        question.choices,
                        answer.answerText.as("answer"),
                        answer.explanation
                )).from(question)
                .rightJoin(question.subject, subject)
                .rightJoin(subject.certification, certification).where(
                        userQuestion.user.eq(user),
                        userQuestion.isBookmarked.eq(true),
                        certification.id.eq(certificationId)
                ).fetch();
    }
}
