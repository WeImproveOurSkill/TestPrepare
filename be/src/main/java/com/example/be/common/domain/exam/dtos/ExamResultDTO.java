package com.example.be.common.domain.exam.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class ExamResultDTO {

    private String certificationName;
    private List<CheckScoreDTO> checkScores;
    private Boolean passFail;
}
