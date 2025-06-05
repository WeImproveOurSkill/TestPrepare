package com.example.be.common.domain.exam.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String answerText;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String explanation;

    @OneToOne
    @JoinColumn(name = "question_id")
    private Question question;
}