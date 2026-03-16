package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "submissions")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = false)
    private Evaluation evaluation;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private LocalDateTime submittedAt = LocalDateTime.now();

    private String fileUrl;

    private Double grade;

    @Column(columnDefinition = "TEXT")
    private String teacherComment;

    @Column(nullable = false)
    private String status; // SUBMITTED, GRADED, LATE
}
