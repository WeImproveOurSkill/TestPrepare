package com.example.be.common.domain.exam.repository.subject;

import com.example.be.common.domain.exam.entity.SubjectExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.security.auth.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<SubjectExam, Long>, SubjectRepositoryQuery{
}
