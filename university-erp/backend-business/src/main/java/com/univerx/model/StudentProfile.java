package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "student_profiles")
public class StudentProfile {
    @Id
    private Long id; // Same as User ID

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String studentNumber;
    private String currentLevel;
    private String currentProgram;
    private String phone;
    private Double gpa;
    private String status; // active, suspended, graduated
    private Boolean canProgress;
    private LocalDate enrollmentDate;
    
    private Integer creditsAcquired;
    private Integer totalCreditsRequired;

    @Column(columnDefinition = "JSONB")
    private String academicRecordJson; // Serialized Map<String, SemesterRecord> for 1:1 parity with TS
}
