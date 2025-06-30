package com.example.questionsserver.entity.middleTable;

import com.example.questionsserver.entity.CertificationType;
import com.example.questionsserver.entity.SubjectExam;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "certification_subject")
public class CertificationSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "certification_type_id")
    private CertificationType certificationType;

    @ManyToOne
    @JoinColumn(name = "subject_exam_id")
    private SubjectExam subjectExam;

}