package com.example.be.common.domain.user.entity;

import com.example.be.common.domain.exam.entity.Certification;
import com.example.be.common.domain.middleTable.userCertification.entity.UserCertification;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    public enum Role {
        COMMON,ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;

    private String email;
    private String nickname;

    private String oauth2Id;

    @Enumerated(EnumType.STRING) // Role을 문자열로 저장
    private Role role;

    private String provider;
    private String providerId;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserCertification> userCertifications = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserQuestion> userQuestions;


    public void addCertification(Certification certification, LocalDateTime acquiredDate, Integer score, String status) {
        UserCertification userCertification = UserCertification.builder()
                .user(this)
                .certification(certification)
                .acquiredDate(acquiredDate)
                .score(score)
                .status(status)
                .build();

        this.userCertifications.add(userCertification);
    }
}