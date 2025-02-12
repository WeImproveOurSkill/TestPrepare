package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.entity.Question;
import com.example.be.common.domain.exam.repository.question.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;

    @Override
    public Question findById(Long questionId) {
        return questionRepository.findById(questionId).orElseThrow(()-> new IllegalArgumentException("해당 문제는 존재하지 않습니다."));
    }
}
