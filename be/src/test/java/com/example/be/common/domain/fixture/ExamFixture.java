package com.example.be.common.domain.fixture;

import com.example.be.common.domain.exam.entity.*;
import com.example.be.common.domain.exam.dtos.*;
import com.example.be.common.domain.middleTable.userQuestion.entity.UserQuestion;

import java.util.*;

public class ExamFixture {

    public static Question createQuestion() {
        Answer answer = Answer.builder()
                .answerText("2")
                .explanation("이것이 정답인 이유는...")
                .build();

        return Question.builder()
                .content("테스트 문제 내용\n1. 선택지1\n2. 선택지2\n3. 선택지3\n4. 선택지4")
                .imageLink("https://example.com/test-image.jpg")
                .answer(answer)
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
        Question question = createQuestion();

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
        return new QuestionDto(2L, "두 번째 테스트 문제\n1. 선택지1\n2. 선택지2\n3. 선택지3\n4. 선택지4", "1", "두 번째 문제의 해설입니다.");

    }

    public static List<QuestionDto> createQuestionDtoList() {
        return Arrays.asList(

                new QuestionDto(2L, "두 번째 테스트 문제\n1. 선택지1\n2. 선택지2\n3. 선택지3\n4. 선택지4", "1", "두 번째 문제의 해설입니다.")
        );
    }

    public static AnswerSubmitDTO createAnswerSubmitDTO() {
        return AnswerSubmitDTO.builder()
                .questionId(1L)
                .answer("2")
                .userAnswer("2")
                .build();
    }

    public static List<AnswerSubmitDTO> createAnswerSubmitDTOList() {
        return Arrays.asList(
                createAnswerSubmitDTO(),
                AnswerSubmitDTO.builder()
                        .questionId(2L)
                        .answer("1")
                        .userAnswer("1")
                        .build()
        );
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
                .certificationId(1L)
                .certificationName("정보처리기사")
                .build();
    }

    public static List<CertificationDto> createCertificationDtoList() {
        return Arrays.asList(
                createCertificationDto(),
                CertificationDto.builder()
                        .certificationId(2L)
                        .certificationName("정보보안기사")
                        .build()
        );
    }

    public static CertificationTypeDto createCertificationTypeDto() {
        return CertificationTypeDto.builder()
                .year(2024)
                .session(1)
                .build();
    }

    public static List<CertificationTypeDto> createCertificationTypeDtoList() {
        return Arrays.asList(
                createCertificationTypeDto(),
                CertificationTypeDto.builder()
                        .year(2024)
                        .session(2)
                        .build()
        );
    }

    public static SubjectDto createSubjectDto() {
        return SubjectDto.builder()
                .subjectId(1L)
                .subjectName("데이터베이스")
                .build();
    }

    public static List<SubjectDto> createSubjectDtoList() {
        return Arrays.asList(
                createSubjectDto(),
                SubjectDto.builder()
                        .subjectId(2L)
                        .subjectName("전자계산기구조")
                        .build()
        );
    }

    public static AnswerRecordDto createAnswerRecordDto() {
        return AnswerRecordDto.builder()
                .questionId(1L)
                .status(UserQuestion.Status.CORRECT)
                .build();
    }

    // 상수 정의
    public static final QuestionDto QUESTION_DTO = createQuestionDto();
    public static final List<QuestionDto> QUESTION_DTOS = createQuestionDtoList();

    public static final AnswerSubmitDTO ANSWER_SUBMIT_DTO = createAnswerSubmitDTO();
    public static final List<AnswerSubmitDTO> ANSWER_SUBMIT_DTOS = createAnswerSubmitDTOList();

    public static final AnswerRecordDto ANSWER_RECORD_DTO = createAnswerRecordDto();

    public static final CertificationDto CERTIFICATION_DTO = createCertificationDto();
    public static final List<CertificationDto> CERTIFICATION_DTOS = createCertificationDtoList();

    public static final CertificationTypeDto CERTIFICATION_TYPE_DTO = createCertificationTypeDto();
    public static final List<CertificationTypeDto> CERTIFICATION_TYPE_DTOS = createCertificationTypeDtoList();

    public static final SubjectDto SUBJECT_DTO = createSubjectDto();
    public static final List<SubjectDto> SUBJECT_DTOS = createSubjectDtoList();
}