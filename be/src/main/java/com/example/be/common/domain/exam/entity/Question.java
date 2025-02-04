package com.example.be.common.domain.exam.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Question {

    public enum QuestionType {
        객관식, 주관식
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    @Lob
    private String choices; // JSON 형식 저장

    private String imageLink;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Answer answer;
}