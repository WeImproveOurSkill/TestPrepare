package com.example.questionsserver.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record QuestionDto(@JsonProperty("questionId") Long questionId, @JsonProperty("content") String content,
                          @JsonProperty("answer") String answer, @JsonProperty("explantion") String explanation) {
}
