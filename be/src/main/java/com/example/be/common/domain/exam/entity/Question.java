package com.example.be.common.domain.exam.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    public enum QuestionType {
        객관식, 주관식
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    private String questionContent;

    @Lob
    private String choices; // JSON 형식 저장

    private String imageLink;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private SubjectExam subjectExam;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Answer answer;
}