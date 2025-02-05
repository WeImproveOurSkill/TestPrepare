package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.dtos.AnswerSubmitDTO;
import com.example.be.common.domain.exam.dtos.ExamResultDTO;
import com.example.be.common.domain.exam.dtos.QuestionDto;
import com.example.be.common.domain.user.entity.User;

import java.util.List;

public interface ExamService {
    List<QuestionDto> getQuestionsByCertification(String name, int year, String session);

    QuestionDto getRandomQuestionsBySubject(Long subjectId, Long questionId, int count);


}
