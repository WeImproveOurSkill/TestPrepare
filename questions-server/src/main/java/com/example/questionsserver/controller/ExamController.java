package com.example.questionsserver.controller;

import com.example.questionsserver.dtos.*;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import com.example.questionsserver.service.ExamService;
import com.example.questionsserver.service.middleTable.UserQuestionService;
import com.example.questionsserver.utils.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exam")
public class ExamController {

    private final ExamService examService;
    private final UserQuestionService userQuestionService;

    private final JwtUtils jwtUtils;

    // 자격증 리스트 -> 자격증 선택 (certification Id)
    @GetMapping
    public ResponseEntity<List<CertificationDto>> getCertificationList() {
        return ResponseEntity.ok(examService.getCertificationList());
    }

    // 자격증 year, session 반환 리스트
    @GetMapping("/certification/{certificationId}/year-session")
    public ResponseEntity<List<CertificationTypeDto>> getCertificationYearSessionInformationList(
            @PathVariable Long certificationId
    ) {
        return ResponseEntity.ok(examService.getCertificationYearSessionInformationList(certificationId));
    }


    // 자격증 선택후 과목 리스트 전송 (certificationId 기준으로 subjectId 리스트 응답값 전송)
    @GetMapping("/certification/{certificationId}")
    public ResponseEntity<List<SubjectDto>> getSubject(@PathVariable Long certificationId) {
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
            @PathVariable Long subjectId, @PathVariable int year, @PathVariable int session) {
        List<QuestionDto> Questions = examService.getQuestionsBySubject(subjectId, year, session);
        return ResponseEntity.ok(Questions);
    }

    // 문제 풀이 제출 - 시험 모드
    @PostMapping("/submit/test")
    public ResponseEntity<ResponseStatus> testCheckAnswers(@RequestHeader("Authorization") String authHeader
            , @RequestBody List<AnswerSubmitDTO> answers) {
        String username = jwtUtils.extractUsername(authHeader);

        userQuestionService.testCheckAnswers(username, answers);
        return ResponseEntity.ok().build();
    }

    // 일반 문제풀이 문제 제출
    @PostMapping("/submit/normal")
    public ResponseEntity<ResponseStatus> studyCheckAnswer(@RequestHeader("Authorization") String authHeader,
                                                           @RequestBody AnswerRecordDto answer) {
        String username = jwtUtils.extractUsername(authHeader);
        userQuestionService.studyCheckAnswer(username, answer);
        return ResponseEntity.ok().build();
    }


    // 틀린 문제 조회 (퀵 모드)
    @GetMapping("/wrong-questions")
    public ResponseEntity<List<QuestionDto>> getWrongQuestions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam UserQuestion.Status status) {
        String username = jwtUtils.extractUsername(authHeader);

        return ResponseEntity.ok(userQuestionService.getWrongQuestions(username, status));
    }

    @PostMapping("/book-mark")
    public ResponseEntity<ResponseStatus> createBookmark(@RequestHeader("Authorization") String authHeader,
                                                         @RequestParam Long questionId) {
        String username = jwtUtils.extractUsername(authHeader);
        userQuestionService.createBookMark(username, questionId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/book-mark")
    public ResponseEntity<List<QuestionInfoDto>> checkBookmarkAndQuestions(@RequestHeader("Authorization") String authHeader) {
        String username = jwtUtils.extractUsername(authHeader);
        return ResponseEntity.ok(userQuestionService.checkBookmarkAndQuestions(username));
    }

    @GetMapping("/book-mark/question")
    public ResponseEntity<List<QuestionDto>> getBookMarkQuestions(@RequestHeader("Authorization") String authHeader,
                                                                  @RequestParam Long certificationId) {
        String username = jwtUtils.extractUsername(authHeader);
        return ResponseEntity.ok(userQuestionService.getBookMarkQuestion(username, certificationId));
    }

    @DeleteMapping("/book-mark")
    public ResponseEntity<ResponseStatus> deleteBookMark(@RequestHeader("Authorization") String authHeader,
                                                         @RequestParam Long questionId) {
        String username = jwtUtils.extractUsername(authHeader);
        userQuestionService.deleteBookMark(username, questionId);
        return ResponseEntity.ok().build();
    }




}
