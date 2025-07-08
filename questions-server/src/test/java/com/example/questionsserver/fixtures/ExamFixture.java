package com.example.questionsserver.fixtures;

import com.example.questionsserver.dtos.*;
import com.example.questionsserver.entity.middleTable.UserQuestion;

import java.util.Arrays;
import java.util.List;

public class ExamFixture {

    public static List<CertificationDto> createCertificationList() {
        return Arrays.asList(
                new CertificationDto(1L, "정보처리기사"),
                new CertificationDto(2L, "컴활1급")
        );
    }

    public static List<CertificationTypeDto> createCertificationTypeList() {
        return Arrays.asList(
                new CertificationTypeDto(2023, 1),
                new CertificationTypeDto(2023, 2)
        );
    }

    public static List<SubjectDto> createSubjectList() {
        return Arrays.asList(
                new SubjectDto(1L, "소프트웨어 설계"),
                new SubjectDto(2L, "프로그래밍 언어 활용")
        );
    }

    public static List<QuestionDto> createQuestionList() {
        return Arrays.asList(
                new QuestionDto(1L, "문제 내용", "4", "해설")
        );
    }

    public static QuestionDto createSingleQuestion() {
        return new QuestionDto(1L, "문제 내용", "4", "해설");
    }

    public static CertificationDto createSingleCertification() {
        return new CertificationDto(1L, "정보처리기사");
    }

    public static CertificationTypeDto createSingleCertificationType() {
        return new CertificationTypeDto(2023, 1);
    }

    public static SubjectDto createSingleSubject() {
        return new SubjectDto(1L, "소프트웨어 설계");
    }

    public static List<AnswerSubmitDTO> createAnswerSubmitList() {
        return Arrays.asList(
                new AnswerSubmitDTO(1L, "4", "4"),
                new AnswerSubmitDTO(2L, "2", "3")
        );
    }

    public static AnswerRecordDto createAnswerRecord() {
        return new AnswerRecordDto(1L, UserQuestion.Status.CORRECT);
    }

}