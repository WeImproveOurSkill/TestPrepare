package com.example.be.common.domain.exam.entity;

import jakarta.persistence.*;
import lombok.*;
import com.querydsl.core.annotations.QueryEntity;

import java.util.UUID;

@Entity
@QueryEntity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content; // 문제 내용과 선택지를 포함한 전체 내용

    private String imageLink;

    @ManyToOne
    @JoinColumn(name = "subject_exam_id")
    private SubjectExam subjectExam;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Answer answer;

}