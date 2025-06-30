package com.example.questionsserver.repository.main;

import com.example.questionsserver.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends JpaRepository<Certification,Long> {
}
