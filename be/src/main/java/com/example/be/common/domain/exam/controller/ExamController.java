package com.example.be.common.domain.exam.controller;

import com.example.be.common.domain.exam.dtos.AnswerSubmitDTO;
import com.example.be.common.domain.exam.dtos.ExamResultDTO;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.exam.entity.Subject;
import com.example.be.common.domain.exam.service.ExamService;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;
import com.example.be.common.domain.middleTable.userQuestion.service.UserQuestionService;
import com.example.be.common.domain.utils.userDetatils.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exam")
public class ExamController {

    private final ExamService examService;
    private final UserQuestionService userQuestionService;

    // 기출 문제 세트 조회
    @GetMapping("/certification")
    public ResponseEntity<List<QuestionDto>> getCertificationQuestions(@RequestParam String name, @RequestParam int year, @RequestParam String session) {
        return ResponseEntity.ok(examService.getQuestionsByCertification(name, year, session));
    }

    // 과목별 문제 조회
    @GetMapping("/subject/{subjectId}/random")
    public ResponseEntity<QuestionDto> getRandomQuestionsBySubject(
            @PathVariable Long subjectId,
            @RequestParam(defaultValue = "-1") Long questionId,
            @RequestParam(defaultValue = "1") int count) {
        return ResponseEntity.ok(examService.getRandomQuestionsBySubject(subjectId, questionId, count));
    }

    // 문제 풀이 제출
    @PostMapping("/submit")
    public ResponseEntity<ExamResultDTO> submitAnswers(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody List<AnswerSubmitDTO> answers) {
        return ResponseEntity.ok(userQuestionService.processAnswers(userDetails.getUser(), answers));
    }

    // 틀린 문제 조회 (퀵 모드)
    @GetMapping("/wrong-questions")
    public ResponseEntity<List<QuestionDto>> getWrongQuestions(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam UserQuestion.Status status) {
        return ResponseEntity.ok(userQuestionService.getWrongQuestions(userDetails.getUser(), status));
    }
}
