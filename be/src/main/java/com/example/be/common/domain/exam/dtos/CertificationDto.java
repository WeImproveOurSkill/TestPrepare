package com.example.be.common.domain.exam.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CertificationDto {
    @JsonProperty("certificationId")
    private Long certificationId;
    @JsonProperty("certificationName")
    private String certificationName;
}
