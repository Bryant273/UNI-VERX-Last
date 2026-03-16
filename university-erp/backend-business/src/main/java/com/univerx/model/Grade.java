package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "grades")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private Double score; // 0-20
    private String appraisal; // Examen, TD, TP
    
    private Double coefficient = 1.0;
    private String semester; // S1, S2, etc.

    @Column(name = "is_locked")
    private Boolean isLocked = false;

    private LocalDateTime gradedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "graded_by")
    private User professor;
}
