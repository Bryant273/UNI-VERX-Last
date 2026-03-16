package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEnrolled; // Mirroring SQL class_id

    private String semester;
    private String academicYear;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    private String fileStatus; // Complet, Incomplet, En attente

    private LocalDateTime enrollmentDate = LocalDateTime.now();
}
