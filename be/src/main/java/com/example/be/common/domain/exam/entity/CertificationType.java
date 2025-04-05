package com.example.be.common.domain.exam.entity;

import com.example.be.common.domain.middleTable.certificationSubject.entity.CertificationSubject;
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

    private Integer year;

    private Integer session;

    @ManyToOne
    @JoinColumn(name = "certification_id")
    private Certification certification;

    @OneToMany(mappedBy = "certificationType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CertificationSubject> certificationSubjects;
}
