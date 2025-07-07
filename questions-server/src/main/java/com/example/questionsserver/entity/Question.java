package com.example.questionsserver.entity;

import com.example.questionsserver.entity.middleTable.UserBookmark;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import com.querydsl.core.annotations.QueryEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@QueryEntity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questions",indexes = {
    @Index(name = "idx_question_subject_exam", columnList = "subject_exam_id")  // 이미 외래키로 자동 생성됨
})
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

        @ManyToOne
    @JoinColumn(name = "certification_type_id")
    private CertificationType certificationType;


    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Answer answer;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserQuestion> userQuestions;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserBookmark> userBookmarks;
}