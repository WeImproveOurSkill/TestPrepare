package com.example.be.common.domain.exam.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Builder
@Getter
@AllArgsConstructor
public class QuestionDto {
    @JsonProperty("questionId")
    private Long questionId;
    @JsonProperty("content")
    private String content;

    @JsonProperty("answer")
    private String answer;

    @JsonProperty("explanation")
    private String explanation;

    public QuestionDto(Long questionId, String question, String choices, String answer, String explanation) {
        this.questionId = questionId;
        this.content = question;
        this.answer = answer;
        this.explanation = explanation;
    }
}
