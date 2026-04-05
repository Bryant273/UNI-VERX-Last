package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "evaluations")
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type; // QCM, DEVOIR, PROJET

    private LocalDateTime deadline;

    @Column(nullable = false)
    private String status; // DRAFT, PUBLISHED, GRADING, COMPLETED

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private LocalDateTime createdAt = LocalDateTime.now();
}
