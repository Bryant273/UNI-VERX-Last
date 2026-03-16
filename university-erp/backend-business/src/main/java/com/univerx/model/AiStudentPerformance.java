package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ai_student_performance")
public class AiStudentPerformance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private Double averageGrade;
    private Double attendanceRate;
    private Double predictedSuccessRate;
    private String trend; // IMPROVING, STABLE, DECLINING

    private LocalDateTime lastAnalyzedAt = LocalDateTime.now();
}
