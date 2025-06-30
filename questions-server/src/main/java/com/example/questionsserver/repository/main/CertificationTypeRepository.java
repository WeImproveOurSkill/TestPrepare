package com.example.questionsserver.repository.main;

import com.example.questionsserver.entity.CertificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationTypeRepository extends JpaRepository<CertificationType, Long> {
}
