package com.example.be.common.domain.exam.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class AnswerSubmitDTO {


    private int questionId;
    private String answer;
    private String userAnswer;


}
