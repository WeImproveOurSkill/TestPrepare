package com.example.questionsserver.entity;

import com.example.questionsserver.entity.middleTable.CertificationSubject;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CertificationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int year;

    private int session;

    @ManyToOne
    @JoinColumn(name = "certification_id")
    private Certification certification;

    @OneToMany(mappedBy = "certificationType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CertificationSubject> certificationSubjects;

        @OneToMany(mappedBy = "certificationType")
    private List<Question> questions;
}
