package com.example.questionsserver.repository.middle.userBookmark;


import com.example.questionsserver.entity.Question;
import com.example.questionsserver.entity.middleTable.UserBookmark;
import com.example.questionsserver.entity.middleTable.UserQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBookmarkRepository extends JpaRepository<UserBookmark, Long>, UserBookmarkRepositoryQuery{
    void deleteUserBookmarkByUsernameAndQuestion(String username, Question question);

}
