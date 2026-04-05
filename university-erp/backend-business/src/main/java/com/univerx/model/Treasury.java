package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "treasury")
public class Treasury {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, name = "origin_or_recipient")
    private String originOrRecipient;

    @Column(nullable = false)
    private String type; // INCOME, EXPENSE

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String status; // COMPLETED, PENDING, PAID, DUE

    private LocalDateTime createdAt = LocalDateTime.now();
}
