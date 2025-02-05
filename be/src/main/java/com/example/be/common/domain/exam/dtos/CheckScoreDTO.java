package com.example.be.common.domain.exam.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class CheckScoreDTO {

    private String subjectName;
    private Integer score;
    private Boolean result;

}
