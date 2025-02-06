package com.example.be.common.domain.exam.service;

import com.example.be.common.domain.exam.entity.Question;

public interface QuestionService {

    Question findById(Long questionId);
}
