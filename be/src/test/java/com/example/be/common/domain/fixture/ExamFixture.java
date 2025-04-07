package com.example.be.common.domain.fixture;

import com.example.be.common.domain.exam.entity.*;
import com.example.be.common.domain.exam.dtos.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ExamFixture {

    public static Question createQuestion() {
        Answer answer = Answer.builder()
                .answerText("2")
                .explanation("이것이 정답인 이유는...")
                .build();

        Question question = Question.builder()
                .content("테스트 문제 내용\n1. 선택지1\n2. 선택지2\n3. 선택지3\n4. 선택지4")
                .imageLink("https://example.com/test-image.jpg")
                .answer(answer)
                .userQuestions(new ArrayList<>())
                .build();

        return Question.builder()
                .content(question.getContent())
                .imageLink(question.getImageLink())
                .answer(Answer.builder()
                        .answerText(answer.getAnswerText())
                        .explanation(answer.getExplanation())
                        .question(question)
                        .build())
                .userQuestions(new ArrayList<>())
                .build();
    }

    public static List<Question> createQuestionList() {
        return Arrays.asList(
                createQuestion(),
                createQuestion()
        );
    }

    public static Answer createAnswer() {
        Question question = Question.builder()
                .content("테스트 문제 내용\n1. 선택지1\n2. 선택지2\n3. 선택지3\n4. 선택지4")
                .imageLink("https://example.com/test-image.jpg")
                .userQuestions(new ArrayList<>())
                .build();

        Answer answer = Answer.builder()
                .answerText("2")
                .explanation("이것이 정답인 이유는...")
                .question(question)
                .build();

        question = Question.builder()
                .content(question.getContent())
                .imageLink(question.getImageLink())
                .answer(answer)
                .userQuestions(new ArrayList<>())
                .build();

        return answer;
    }

    public static List<Answer> createAnswerList() {
        return Arrays.asList(
                createAnswer(),
                createAnswer()
        );
    }

    public static SubjectExam createSubjectExam() {
        List<Question> questions = createQuestionList();
        
        SubjectExam subjectExam = SubjectExam.builder()
                .name("데이터베이스")
                .questions(new ArrayList<>())
                .certificationSubjects(new ArrayList<>())
                .build();

        questions = questions.stream()
                .map(question -> {
                    Answer answer = question.getAnswer();
                    return Question.builder()
                            .content(question.getContent())
                            .imageLink(question.getImageLink())
                            .answer(Answer.builder()
                                    .answerText(answer.getAnswerText())
                                    .explanation(answer.getExplanation())
                                    .question(question)
                                    .build())
                            .subjectExam(subjectExam)
                            .userQuestions(new ArrayList<>())
                            .build();
                })
                .toList();

        return SubjectExam.builder()
                .name(subjectExam.getName())
                .questions(questions)
                .certificationSubjects(new ArrayList<>())
                .build();
    }

    public static QuestionDto createQuestionDto() {
        return QuestionDto.builder()
                .content("DTO 테스트 문제 내용\n1. 선택지1\n2. 선택지2\n3. 선택지3\n4. 선택지4")
                .build();
    }

    public static AnswerSubmitDTO createAnswerSubmitDTO() {
        return AnswerSubmitDTO.builder()
                .questionId(1L)
                .userAnswer("2")
                .build();
    }

    public static ExamResultDTO createExamResultDTO() {
        int totalQuestions = 10;
        int correctAnswers = 7;
        double score = ((double) correctAnswers / totalQuestions) * 100;
        
        return ExamResultDTO.builder()
                .certificationName("정보처리기사")
                .checkScores(null)  // 필요에 따라 채워넣을 수 있음
                .passFail(score >= 60)  // 예시: 60점 이상이면 합격
                .build();
    }

    public static Certification createCertification() {
        List<SubjectExam> subjectExams = Arrays.asList(createSubjectExam());
        
        Certification certification = Certification.builder()
                .name("정보처리기사")
                .userCertifications(new ArrayList<>())
                .subjectExams(new ArrayList<>())
                .certificationTypes(new ArrayList<>())
                .build();

        List<CertificationType> types = Arrays.asList(
                CertificationType.builder()
                        .year(2024)
                        .session(1)
                        .certification(certification)
                        .certificationSubjects(new ArrayList<>())
                        .build(),
                CertificationType.builder()
                        .year(2024)
                        .session(2)
                        .certification(certification)
                        .certificationSubjects(new ArrayList<>())
                        .build()
        );

        subjectExams = subjectExams.stream()
                .map(subject -> SubjectExam.builder()
                        .name(subject.getName())
                        .certification(certification)
                        .questions(subject.getQuestions())
                        .certificationSubjects(new ArrayList<>())
                        .build())
                .toList();

        return Certification.builder()
                .name(certification.getName())
                .certificationTypes(types)
                .subjectExams(subjectExams)
                .userCertifications(new ArrayList<>())
                .build();
    }

    public static CertificationType createCertificationType() {
        Certification certification = createCertification();
        
        return CertificationType.builder()
                .year(2024)
                .session(1)
                .certification(certification)
                .certificationSubjects(new ArrayList<>())
                .build();
    }

    public static Certification createFullCertification() {
        List<SubjectExam> subjectExams = Arrays.asList(
                createSubjectExam(),
                SubjectExam.builder()
                        .name("전자계산기구조")
                        .questions(createQuestionList())
                        .certificationSubjects(new ArrayList<>())
                        .build()
        );

        Certification certification = Certification.builder()
                .name("정보처리기사")
                .userCertifications(new ArrayList<>())
                .subjectExams(new ArrayList<>())
                .certificationTypes(new ArrayList<>())
                .build();

        List<CertificationType> types = Arrays.asList(
                CertificationType.builder()
                        .year(2024)
                        .session(1)
                        .certification(certification)
                        .certificationSubjects(new ArrayList<>())
                        .build(),
                CertificationType.builder()
                        .year(2024)
                        .session(2)
                        .certification(certification)
                        .certificationSubjects(new ArrayList<>())
                        .build()
        );

        subjectExams = subjectExams.stream()
                .map(subject -> SubjectExam.builder()
                        .name(subject.getName())
                        .certification(certification)
                        .questions(subject.getQuestions().stream()
                                .map(question -> {
                                    Answer answer = question.getAnswer();
                                    return Question.builder()
                                            .content(question.getContent())
                                            .imageLink(question.getImageLink())
                                            .answer(Answer.builder()
                                                    .answerText(answer.getAnswerText())
                                                    .explanation(answer.getExplanation())
                                                    .build())
                                            .userQuestions(new ArrayList<>())
                                            .build();
                                })
                                .toList())
                        .certificationSubjects(new ArrayList<>())
                        .build())
                .toList();

        return Certification.builder()
                .name(certification.getName())
                .certificationTypes(types)
                .subjectExams(subjectExams)
                .userCertifications(new ArrayList<>())
                .build();
    }

    public static CertificationDto createCertificationDto() {
        return CertificationDto.builder()
                .certificationName("정보처리기사")
                .build();
    }

    public static CertificationTypeDto createCertificationTypeDto() {
        return CertificationTypeDto.builder()
                .year(2024)
                .session(1)
                .build();
    }

    public static SubjectDto createSubjectDto() {
        return SubjectDto.builder()
                .subjectName("데이터베이스")
                .build();
    }
}