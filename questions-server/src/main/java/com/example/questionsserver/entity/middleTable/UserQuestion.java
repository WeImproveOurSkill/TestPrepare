package com.example.questionsserver.entity.middleTable;

import com.example.questionsserver.entity.Question;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "user_question",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_question_user_name_question", columnNames = {"user_name","question_id"})
        },
        indexes = {
                // 복합 인덱스
                @Index(name = "idx_user_question_user_status", columnList = "user_id,status")
        }
)
public class UserQuestion {


    public void updateRecord(Status status) {
        this.status = status;
    }


    public enum Status {
        CORRECT, WRONG;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //    @ManyToOne
    @Column(name = "user_name")
    private String userName;

    private LocalDateTime solveTime; // 최근 푼 문제 조회를 위한 시간변

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")

    private Status status;

    private Boolean isBookmarked; // 북마크 용도

    public void updateBookmark() {
        if (!this.isBookmarked) {
            this.isBookmarked = true;
        } else {
            this.isBookmarked = false;
        }
    }

    public void checkAnswer() {

    }
}