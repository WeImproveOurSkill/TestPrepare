package com.example.be.common.domain.middleTable.userQuestion.entity;

import com.example.be.common.domain.exam.entity.Question;
import com.example.be.common.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_question")
public class UserQuestion {

    public enum Status {
        CORRECT, WRONG, UNANSWERED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime solveTime; // 최근 푼 문제 조회를 위한 시간변

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Enumerated(EnumType.STRING)
    private Status status;

    private boolean isBookmarked; // 북마크 용도

    private boolean isRequest; // 사용자 요청을 통한 요청 금지 문제 표현
}