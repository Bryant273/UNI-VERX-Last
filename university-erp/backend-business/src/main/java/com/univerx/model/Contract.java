package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "contracts")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String contractorName;

    @Column(nullable = false)
    private String contractorType; // EMPLOYEE, SUBCONTRACTOR, CONSULTANT

    @Column(nullable = false)
    private String contractType; // CDI, CDD, PRESTATION, STAGE

    @Column(nullable = false)
    private String roleOrService;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(nullable = false)
    private String status; // ACTIVE, EXPIRED, PENDING, TERMINATED

    private Double amount;
    
    @Column(length = 10)
    private String currency = "FCFA";

    private String documentUrl;

    private LocalDateTime createdAt = LocalDateTime.now();
}
