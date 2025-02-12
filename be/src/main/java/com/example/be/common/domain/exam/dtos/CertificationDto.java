package com.example.be.common.domain.exam.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CertificationDto {
    private Long CertificationId;
    private String CertificationName;
}
