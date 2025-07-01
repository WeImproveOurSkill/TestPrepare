package com.example.questionsserver.repository.middle.userQuestionQuery;

import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.example.questionsserver.entity.QAnswer.answer;
import static com.example.questionsserver.entity.QCertification.certification;
import static com.example.questionsserver.entity.QQuestion.question;
import static com.example.questionsserver.entity.middleTable.QUserQuestion.userQuestion;

@RequiredArgsConstructor
public class UserQuestionRepositoryQueryImpl implements UserQuestionRepositoryQuery{

    private final JPAQueryFactory jpaQueryFactory;


    @Override
    public List<QuestionDto> findAllAboutWrongQuestionByStatus(String username, UserQuestion.Status status) {
        return jpaQueryFactory.select(Projections.constructor(
                        QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("question"),
                        answer.answerText.as("answer"),
                        answer.explanation
                )).from(userQuestion)
                .leftJoin(userQuestion.question, question)
                .leftJoin(question.answer, answer)
                .where(userQuestion.status.eq(status),
                        userQuestion.userName.eq(username))
                .fetch();
//        return null;
    }

    @Override
    public List<QuestionDto> getBookMarkQuestion(String username, Long certificationId) {
        return jpaQueryFactory.select(Projections.constructor(
                        QuestionDto.class,
                        question.id.as("questionId"),
                        question.content.as("question"),
                        answer.answerText.as("answer"),
                        answer.explanation
                )).from(userQuestion)
                .join(userQuestion.question, question)
                .join(question.certificationType.certification, certification)// question과 명시적 조인
                .where(
                        userQuestion.userName.eq(username),         // 사용자 직접 비교
                        userQuestion.isBookmarked.isTrue(), // 북마크 상태 확인
                        question.certificationType.certification.id.eq(certificationId) // certification ID 필터링
                )
                .fetch();
//        return null;

    }
}
