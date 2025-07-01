package com.example.questionsserver.entity.middleTable;


import com.example.questionsserver.entity.Certification;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_certification",
uniqueConstraints = @UniqueConstraint(name = "uk_user_certification_user_name_certification", columnNames = {"user_name", "certification_id"}
))
public class UserCertification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name")
    private String userName;

    @ManyToOne
    @JoinColumn(name = "certification_id")
    private Certification certification;

    // 필요한 추가 필드들
    private LocalDateTime acquiredDate;

    // 기타 필요한 정보들 (점수, 상태 등)를 추가할 수 있습니다
    private Integer score;
    private String status; // "합격", "불합격", "준비중" 등
}