package com.example.be.common.domain.user.entity;

import com.example.be.common.domain.exam.entity.Certification;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
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

    @ManyToMany
    @JoinTable(
            name = "user_certification",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "certification_id")
    )
    private Set<Certification> certifications = new HashSet<>();
}