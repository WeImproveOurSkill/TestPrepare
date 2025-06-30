package com.example.questionsserver.dtos;

import com.example.questionsserver.entity.middleTable.UserQuestion;


public record AnswerSubmitDTO(Long questionId, String answer, String userAnswer) {
}
