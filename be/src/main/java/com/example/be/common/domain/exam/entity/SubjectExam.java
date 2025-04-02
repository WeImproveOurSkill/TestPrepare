package com.example.be.common.domain.exam.entity;

import com.example.be.common.domain.middleTable.certificationSubject.entity.CertificationSubject;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subject_exam",indexes = {
    @Index(name = "idx_subject_exam_certification", columnList = "certification_id")
})
public class SubjectExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "certification_id")
    private Certification certification;

    @OneToMany(mappedBy = "subjectExam", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    @OneToMany(mappedBy = "subjectExam", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CertificationSubject> certificationSubjects;
}