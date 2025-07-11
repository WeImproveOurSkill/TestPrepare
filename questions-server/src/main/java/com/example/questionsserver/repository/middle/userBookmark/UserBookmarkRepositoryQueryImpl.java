package com.example.questionsserver.repository.middle.userBookmark;

import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.dtos.QuestionInfoDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.example.questionsserver.entity.QAnswer.answer;
import static com.example.questionsserver.entity.QCertification.certification;
import static com.example.questionsserver.entity.QQuestion.question;
import static com.example.questionsserver.entity.QSubjectExam.subjectExam;
import static com.example.questionsserver.entity.middleTable.QUserBookmark.userBookmark;

@RequiredArgsConstructor
public class UserBookmarkRepositoryQueryImpl implements UserBookmarkRepositoryQuery {
    private final JPAQueryFactory queryFactory;


    @Override
    public List<QuestionDto> getBookMarkQuestion(String username, Long certificationId) {
        return queryFactory.select(Projections.constructor(QuestionDto.class,
                question.id.as("questionId"),
                question.content.as("question"),
                answer.answerText.as("answer"),
                answer.explanation
                )).from(userBookmark)
                .join(userBookmark.question, question)
                .join(question.subjectExam, subjectExam)
                .join(subjectExam.certification,certification)
                .where(userBookmark.username.eq(username), certification.id.eq(certificationId))
                .fetch();
    }

    @Override
    public List<QuestionInfoDto> checkBookmarkAndQuestions(String username) {
        return queryFactory.select(Projections.constructor(QuestionInfoDto.class,
                        question.id.as("questionId")))
                .from(userBookmark)
                .join(userBookmark.question, question)
                .where(userBookmark.username.eq(username))
                .fetch();
    }

}
