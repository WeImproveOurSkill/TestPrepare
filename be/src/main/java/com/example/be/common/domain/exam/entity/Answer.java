package com.example.be.common.domain.exam.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String answerText;

    @Lob
    private String explanation;

    @OneToOne
    @JoinColumn(name = "question_id")
    private Question question;
}