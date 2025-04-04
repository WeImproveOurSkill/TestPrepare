package com.example.be.common.domain.middleTable.userCertification.entity;


import com.example.be.common.domain.exam.entity.Certification;
import com.example.be.common.domain.user.entity.User;
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
@Table(name = "user_certification")
public class UserCertification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "certification_id")
    private Certification certification;

    // 필요한 추가 필드들
    private LocalDateTime acquiredDate;

    // 기타 필요한 정보들 (점수, 상태 등)를 추가할 수 있습니다
    private Integer score;
    private String status; // "합격", "불합격", "준비중" 등
}