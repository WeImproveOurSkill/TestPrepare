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
@Table(
    name = "user_question",
    indexes = {
        // 복합 인덱스 
        @Index(name = "idx_user_question_user_status", columnList = "user_id,status")
    }
)public class UserQuestion {



    public enum Status {
        CORRECT, WRONG ;
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
    @Column(name = "status")

    private Status status;

    private Boolean isBookmarked; // 북마크 용도

    public void updateBookmark() {
        if(!this.isBookmarked){
            this.isBookmarked = true;
        }else{
            this.isBookmarked = false;
        }
    }
}