package com.example.be.common.domain.exam.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class SubjectDto {
    @JsonProperty("subjectId")
    private Long subjectId;
    @JsonProperty("subjectName")
    private String subjectName;
}
