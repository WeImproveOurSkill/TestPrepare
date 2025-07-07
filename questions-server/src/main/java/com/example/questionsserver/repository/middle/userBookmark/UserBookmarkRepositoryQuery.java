package com.example.questionsserver.repository.middle.userBookmark;

import com.example.questionsserver.dtos.QuestionDto;

import java.util.List;

public interface UserBookmarkRepositoryQuery {
    List<QuestionDto> getBookMarkQuestion(String username, Long certificationId);
}
