package com.example.questionsserver.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CertificationDto(@JsonProperty("certificationId") Long certificationId, @JsonProperty("certificationName") String certificationName) {
}
