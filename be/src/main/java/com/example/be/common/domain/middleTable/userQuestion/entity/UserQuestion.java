package com.example.be.common.domain.middleTable.userQuestion.entity;

import com.example.be.common.domain.exam.entity.Question;
import com.example.be.common.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Enumerated(EnumType.STRING)
    private Status status;

    private int attemptCount;
    private boolean isBookmarked;
}