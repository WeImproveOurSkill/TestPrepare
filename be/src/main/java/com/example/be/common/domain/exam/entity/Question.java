package com.example.be.common.domain.exam.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
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
    @JoinColumn(name = "subject_id")
    private SubjectExam subjectExam;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Answer answer;

    // content에서 선택지 부분만 추출하는 메서드
    public String getChoices() {
        if (content != null) {
            return content.replaceAll(".*?(?=1\\)|$)", "");
        }
        return null;
    }

    // content에서 문제 내용만 추출하는 메서드
    public String getQuestionContent() {
        if (content != null) {
            return content.replaceAll("(?:1\\)|2\\)|3\\)|4\\)|5\\)).*", "").trim();
        }
        return null;
    }
}