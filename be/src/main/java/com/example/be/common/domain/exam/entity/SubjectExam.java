package com.example.be.common.domain.exam.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
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
}