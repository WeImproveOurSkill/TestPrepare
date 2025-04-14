package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.dtos.CertificationTypeDto;
import com.example.be.common.domain.exam.dtos.SubjectDto;
import com.example.be.common.domain.exam.dtos.CertificationDto;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.exam.repository.AnswerRepository;
import com.example.be.common.domain.exam.repository.certification.CertificationRepository;
import com.example.be.common.domain.exam.repository.question.QuestionRepository;
import com.example.be.common.domain.exam.repository.subject.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {
    private final CertificationRepository certificationRepository;
    private final SubjectRepository subjectRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    /***
     * // 기출 문제 세트 조회
     * @param name
     * @param year
     * @param session
     * @return List<QuestionDto>
     */
    @Override
    @Transactional(readOnly = true)
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
    public List<CertificationTypeDto> getCertificationYearSessionList(Long certificationId) {
        return certificationRepository.findAllYearAndSessionByCertificationId(certificationId);
    }

    @Override
//    @Cacheable(value = "questions", key = "#subjectId + '_' + #year + '_' + #session")
    public List<QuestionDto> getQuestionsBySubject(Long subjectId, int year, int session) {
        return questionRepository.findAllQuestionBySubjectAndYearSession(subjectId, year, session);
    }

}
