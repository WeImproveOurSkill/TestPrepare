package com.example.questionsserver.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CertificationTypeDto(@JsonProperty("year") int year, @JsonProperty("session") int session) {
}
