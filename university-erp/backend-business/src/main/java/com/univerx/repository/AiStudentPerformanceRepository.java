package com.univerx.repository;

import com.univerx.model.AiStudentPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AiStudentPerformanceRepository extends JpaRepository<AiStudentPerformance, Long> {
    Optional<AiStudentPerformance> findByStudentId(Long studentId);
}
