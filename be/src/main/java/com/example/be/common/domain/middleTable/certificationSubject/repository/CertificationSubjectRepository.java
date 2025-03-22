package com.example.be.common.domain.middleTable.certificationSubject.repository;

import com.example.be.common.domain.middleTable.certificationSubject.entity.CertificationSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationSubjectRepository extends JpaRepository<CertificationSubject, Long> {
}
