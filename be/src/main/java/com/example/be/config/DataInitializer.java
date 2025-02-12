package com.example.be.config;

import com.example.be.common.domain.exam.entity.Answer;
import com.example.be.common.domain.exam.entity.Certification;
import com.example.be.common.domain.exam.entity.Question;
import com.example.be.common.domain.exam.entity.SubjectExam;
import com.example.be.common.domain.exam.repository.certification.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
//@Profile({"dev", "docker"})  // docker 프로필 추가
public class DataInitializer implements CommandLineRunner {

    private final CertificationRepository certificationRepository;

    @Override
    public void run(String... args) {
        // 기존 데이터가 있는지 확인
        if (certificationRepository.count() > 0) {
            return; // 데이터가 이미 있으면 초기화하지 않음
        }

        // 정보처리기사 자격증 데이터 생성
        Certification infoCert = Certification.builder()
            .name("정보처리기사")
            .year(2024)
            .session("1회차")
            .subjectExams(Arrays.asList(
                // 1. 소프트웨어 설계 과목
                SubjectExam.builder()
                    .name("소프트웨어 설계")
                    .questions(Arrays.asList(
                        Question.builder()
                            .questionType(Question.QuestionType.객관식)
                            .questionContent("소프트웨어 생명주기 모델 중 폭포수 모델의 특징으로 가장 적절하지 않은 것은?")
                            .choices("[\"1. 단계별 정형화된 접근방법으로 체계적인 개발이 가능하다.\", " +
                                   "\"2. 단계별 산출물이 명확하게 정의된다.\", " +
                                   "\"3. 요구사항 변경에 유연하게 대처할 수 있다.\", " +
                                   "\"4. 프로젝트 관리가 용이하다.\"]")
                            .answer(Answer.builder()
                                .answerText("3")
                                .explanation("폭포수 모델은 요구사항 변경에 대한 유연성이 떨어지는 것이 단점입니다.")
                                .build())
                            .build()
                    ))
                    .build(),
                
                // 2. 소프트웨어 개발 과목
                    SubjectExam.builder()
                    .name("소프트웨어 개발")
                    .questions(Arrays.asList(
                        Question.builder()
                            .questionType(Question.QuestionType.객관식)
                            .questionContent("다음 중 SQL의 DDL(Data Definition Language)에 속하지 않는 것은?")
                            .choices("[\"1. CREATE\", " +
                                   "\"2. ALTER\", " +
                                   "\"3. INSERT\", " +
                                   "\"4. DROP\"]")
                            .answer(Answer.builder()
                                .answerText("3")
                                .explanation("INSERT는 DML(Data Manipulation Language)에 속합니다.")
                                .build())
                            .build()
                    ))
                    .build(),
                
                // 3. 데이터베이스 구축 과목
                    SubjectExam.builder()
                    .name("데이터베이스 구축")
                    .questions(Arrays.asList(
                        Question.builder()
                            .questionType(Question.QuestionType.객관식)
                            .questionContent("다음 중 데이터베이스의 무결성 제약조건이 아닌 것은?")
                            .choices("[\"1. 개체 무결성\", " +
                                   "\"2. 참조 무결성\", " +
                                   "\"3. 도메인 무결성\", " +
                                   "\"4. 시간 무결성\"]")
                            .answer(Answer.builder()
                                .answerText("4")
                                .explanation("시간 무결성은 데이터베이스의 기본적인 무결성 제약조건이 아닙니다.")
                                .build())
                            .build()
                    ))
                    .build()
            ))
            .build();

        certificationRepository.save(infoCert);
    }
} 