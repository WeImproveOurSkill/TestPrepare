package com.example.be.common.domain.exam.repository.certificationType;

import com.example.be.common.domain.exam.entity.CertificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationTypeRepository extends JpaRepository<CertificationType, Long> {
}
