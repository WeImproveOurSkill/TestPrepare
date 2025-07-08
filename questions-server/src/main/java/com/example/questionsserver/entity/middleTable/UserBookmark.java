package com.example.questionsserver.entity.middleTable;

import com.example.questionsserver.entity.Question;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "user_bookmark",
//        uniqueConstraints = {
//                @UniqueConstraint(name = "uk_user_question_user_name_question", columnNames = {"user_name","question_id"})
//        },
//        indexes = {
//                // 복합 인덱스
//                @Index(name = "idx_user_question_user_status", columnList = "user_name,status")
//        }
        uniqueConstraints={
        @UniqueConstraint(name = "uk_user_bookmark_user_name_question", columnNames = {"user_name", "question_id"})}
        )
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class UserBookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name")
    private String username;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;


    private LocalDateTime createdAt;


}
