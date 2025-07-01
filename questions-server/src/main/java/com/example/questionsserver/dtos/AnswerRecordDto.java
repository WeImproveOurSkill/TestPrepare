package com.example.questionsserver.dtos;

import com.example.questionsserver.entity.middleTable.UserQuestion;

public record AnswerRecordDto(Long questionId, UserQuestion.Status status ) {
}
