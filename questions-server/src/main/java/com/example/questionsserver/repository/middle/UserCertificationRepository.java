package com.example.questionsserver.repository.middle;

import com.example.questionsserver.entity.middleTable.UserCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCertificationRepository extends JpaRepository<UserCertification, Long> {
}
