package com.example.be.common.domain.exam.dtos;


import com.example.be.common.domain.exam.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Builder
@Getter
public class QuestionDto {

    private Long questionId;

    private String question;

    private Question.QuestionType questionType;

    private String choices; // JSON 형식 저장

    private String answer;

    private String explanation;

    public QuestionDto(Long questionId, String question, Question.QuestionType questionType,
                       String choices, String answer, String explanation) {
        this.questionId = questionId;
        this.question = question;
        this.questionType = questionType;
        this.choices = choices;
        this.answer = answer;
        this.explanation = explanation;
    }
}
