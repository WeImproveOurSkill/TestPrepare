package com.example.be.common.domain.exam.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Builder
@Getter
@AllArgsConstructor
public class QuestionDto {

    private Long questionId;

    private String content;

    private String answer;

    private String explanation;

    public QuestionDto(Long questionId, String question, String choices, String answer, String explanation) {
        this.questionId = questionId;
        this.content = question;
        this.answer = answer;
        this.explanation = explanation;
    }
}
