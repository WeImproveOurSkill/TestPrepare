package com.example.questionsserver.repository.middle;

import com.example.questionsserver.entity.middleTable.CertificationSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationSubjectRepository extends JpaRepository<CertificationSubject, Long> {
}
