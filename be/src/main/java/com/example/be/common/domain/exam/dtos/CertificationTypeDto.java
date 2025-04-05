package com.example.be.common.domain.exam.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CertificationTypeDto {
    @JsonProperty("year")
    private Integer year;
    @JsonProperty("session")
    private Integer session;
}
