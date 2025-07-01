package com.example.questionsserver.service;


import com.example.questionsserver.dtos.CertificationDto;
import com.example.questionsserver.dtos.CertificationTypeDto;
import com.example.questionsserver.dtos.QuestionDto;
import com.example.questionsserver.dtos.SubjectDto;
import com.example.questionsserver.entity.Question;
import com.example.questionsserver.repository.main.answer.AnswerRepository;
import com.example.questionsserver.repository.main.certification.CertificationRepository;
import com.example.questionsserver.repository.main.subjectExam.SubjectExamRepository;
import com.example.questionsserver.repository.main.question.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final CertificationRepository certificationRepository;
    private final SubjectExamRepository subjectRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;


    /***
     * // 기출 문제 세트 조회
     * @param name
     * @param year
     * @param session
     * @return List<QuestionDto>
     */
    @Transactional(readOnly = true)
    @Override
    public List<QuestionDto> getQuestionsByCertification(String name, int year, int session) {
        return certificationRepository.findAllQuestionByNameAndYearAndSession(name,year,session) ;
    }

    /***
     * 문제, 정답 조회 로직
     * @param subjectId
     * @return
     */
    @Override
    @Transactional(readOnly = true)
    public QuestionDto getQuestionsBySubject(Long subjectId, Long questionId) {
        return questionRepository.findByQuestionBySubjectSizeCount(subjectId, questionId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "certifications")
    public List<CertificationDto> getCertificationList() {
        return certificationRepository.findAllByCertificationInformation();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "subjects", key = "#certificationId")
    public List<SubjectDto> getSubject(Long certificationId) {
        return subjectRepository.getSubjectByCertificationId(certificationId);
    }

    @Override
    public List<QuestionDto> getRandomQuestionsBySubject(Long subjectId) {
        return questionRepository.findAllbySubjectIdAndRandomNumber(subjectId);
    }

    @Override
    @Cacheable(value = "yearSessions", key = "#certificationId")
    public List<CertificationTypeDto> getCertificationYearSessionInformationList(Long certificationId) {
        return certificationRepository.findAllYearAndSessionByCertificationId(certificationId);
    }

    @Override
//    @Cacheable(value = "questions", key = "#subjectId + '_' + #year + '_' + #session")
    public List<QuestionDto> getQuestionsBySubject(Long subjectId, int year, int session) {
        return questionRepository.findAllQuestionBySubjectAndYearSession(subjectId, year, session);
    }

    public Question findById(Long questionId) {
        return questionRepository.findById(questionId).orElseThrow(()-> new IllegalArgumentException("존재하지 않는 문제입니다."));
    }

}
