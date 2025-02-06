package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.dtos.SubjectDto;
import com.example.be.common.domain.exam.dtos.CertificationDto;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.exam.repository.AnswerRepository;
import com.example.be.common.domain.exam.repository.certification.CertificationRepository;
import com.example.be.common.domain.exam.repository.question.QuestionRepository;
import com.example.be.common.domain.exam.repository.subject.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    public List<QuestionDto> getQuestionsByCertification(String name, int year, String session) {
        return certificationRepository.findAllQuestionByNameAndYearAndSession(name,year,session) ;
    }

    /***
     * 문제, 정답 조회 로직
     * @param subjectId
     * @return
     */
    @Override
    public QuestionDto getRandomQuestionsBySubject(Long subjectId,Long questionId) {
        return questionRepository.findByQuestionBySubjectSizeCount(subjectId, questionId);
    }

    @Override
    public List<CertificationDto> getCertificationList() {
        return certificationRepository.findAllByCertificationInformation();
    }

    @Override
    public List<SubjectDto> getSubject(Long certificationId) {
        return subjectRepository.getSubjectByCertificationId(certificationId);
    }

}
