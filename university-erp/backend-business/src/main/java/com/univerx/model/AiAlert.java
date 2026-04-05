package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ai_alerts")
public class AiAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private String type; // PERFORMANCE_DROP, ABSENCE_WARNING, EXCELLENCE_KUDOS

    private String severity = "INFO"; // INFO, WARNING, CRITICAL

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "ai_metadata", columnDefinition = "JSONB")
    private String aiMetadata;

    private LocalDateTime createdAt = LocalDateTime.now();
}
