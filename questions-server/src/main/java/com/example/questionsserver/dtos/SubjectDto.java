package com.example.questionsserver.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SubjectDto(@JsonProperty("subjectId") Long subjectId, @JsonProperty("subjectName") String subjectName) {
}
