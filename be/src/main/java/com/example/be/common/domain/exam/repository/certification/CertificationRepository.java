package com.example.be.common.domain.exam.repository.certification;

import com.example.be.common.domain.exam.dtos.CertificationDto;
import com.example.be.common.domain.exam.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long>, CertificationRepositoryQuery {
    List<CertificationDto> findAllByCertificationInformation();
}
