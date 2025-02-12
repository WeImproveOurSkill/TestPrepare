package com.example.be.common.domain.exam.dtos;

import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class AnswerRecordDto {

    private Long questionId;
    private UserQuestion.Status status;
}
