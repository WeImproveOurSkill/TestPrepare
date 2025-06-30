package com.example.questionsserver.repository.main.question;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class QuestionRepositoryQueryImpl implements QuestionRepositoryQuery{

    private final JPAQueryFactory jpaQueryFactory;
}
