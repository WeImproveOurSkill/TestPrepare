package com.example.be.common.domain.exam.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public record QuestionDto(@JsonProperty("questionId") Long questionId, @JsonProperty("content") String content,
                          @JsonProperty("answer") String answer, @JsonProperty("explantion") String explanation) {

}
