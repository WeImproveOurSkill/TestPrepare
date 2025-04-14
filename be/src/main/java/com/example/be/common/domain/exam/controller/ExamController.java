package com.example.be.common.domain.exam.controller;

import com.example.be.common.domain.exam.dtos.*;
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

    // 자격증 리스트 -> 자격증 선택 (certification Id)
    @GetMapping
    public ResponseEntity<List<CertificationDto>> getCertificationList() {
        return ResponseEntity.ok(examService.getCertificationList());
    }
    // 자격증 year, session 반환 리스트
    @GetMapping("/certification/{certificationId}/year-session")
    public ResponseEntity<List<CertificationTypeDto>> getCertificationYearSessionList(
            @PathVariable Long certificationId
    ) {
        return ResponseEntity.ok(examService.getCertificationYearSessionList(certificationId));
    }

    // 기출 문제 세트 조회
//    @GetMapping("/certification")
//    public ResponseEntity<List<QuestionDto>> getCertificationQuestions(@RequestParam String certificationName, @RequestParam int year, @RequestParam int session) {
//        return ResponseEntity.ok(examService.getQuestionsByCertification(certificationName, year, session));
//    }


    // 자격증 선택후 과목 리스트 전송 (certificationId 기준으로 subjectId 리스트 응답값 전송)
    @GetMapping("/certification/{certificationId}")
    public ResponseEntity<List<SubjectDto>> getCertification(@PathVariable Long certificationId) {
        return ResponseEntity.ok(examService.getSubject(certificationId));
    }


    // 과목별 문제 조회
    @Deprecated()
    @GetMapping("/subject/{subjectId}/question")
    public ResponseEntity<QuestionDto> getQuestionsBySubject(
            @PathVariable Long subjectId,
            @RequestParam(defaultValue = "0") Long questionId) {
        QuestionDto QuestionsBySubject = examService.getQuestionsBySubject(subjectId, questionId);
        return ResponseEntity.ok(QuestionsBySubject);
    }

    // 과목별 랜덤문제 리스트 조회 - 공부모드
    @GetMapping("/subject/{subjectId}/random")
    public ResponseEntity<List<QuestionDto>> getRandomQuestionsBySubject(
            @PathVariable Long subjectId) {
        List<QuestionDto> Questions = examService.getRandomQuestionsBySubject(subjectId);
        return ResponseEntity.ok(Questions);
    }
    // 과목별 기출 리스트 조회 - 시험모드
    @GetMapping("/subject/{subjectId}/year/{year}/session/{session}")
    public ResponseEntity<List<QuestionDto>> getQuestionsBySubject(
            @PathVariable Long subjectId, @PathVariable int year,@PathVariable  int session) {
        List<QuestionDto> Questions = examService.getQuestionsBySubject(subjectId,year, session);
        return ResponseEntity.ok(Questions);
    }

    // 문제 풀이 제출 - 시험 모드
    @PostMapping("/submit/test")
    public ResponseEntity<ResponseStatus> submitAnswers(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody List<AnswerSubmitDTO> answers) {
        userQuestionService.submitAnswers(userDetails.getUser(), answers);
        return ResponseEntity.ok().build();
    }

    // 일반 문제풀이 문제 제출
    @PostMapping("/submit/normal")
    public ResponseEntity<ResponseStatus> checkAnswer(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody AnswerRecordDto answer) {
        userQuestionService.checkAnswer(userDetails.getUser(), answer);
        return ResponseEntity.ok().build();
    }


    // 틀린 문제 조회 (퀵 모드)
    @GetMapping("/wrong-questions")
    public ResponseEntity<List<QuestionDto>> getWrongQuestions(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam UserQuestion.Status status) {
        return ResponseEntity.ok(userQuestionService.getWrongQuestions(userDetails.getUser(), status));
    }

    @PatchMapping("/book-mark")
    public ResponseEntity<ResponseStatus> updateBookMark(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestParam Long questionId) {
        userQuestionService.updateBookMark(userDetails.getUser(), questionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/book-mark/question")
    public ResponseEntity<List<QuestionDto>> getBookMarkQuestions(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestParam Long certificationId) {
        return ResponseEntity.ok(userQuestionService.getBookMarkQuestion(userDetails.getUser(), certificationId));
    }


}
