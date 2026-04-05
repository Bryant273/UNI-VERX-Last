package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ai_audit_logs")
public class AiAuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flow_name", nullable = false)
    private String flowName;

    @Column(name = "trigger_type")
    private String triggerType; // MANUAL, SCHEDULED

    @Column(name = "context_data", columnDefinition = "JSONB")
    private String contextData;

    @Column(name = "result_summary", columnDefinition = "TEXT")
    private String resultSummary;

    @Column(name = "execution_time_ms")
    private Integer executionTimeMs;

    private LocalDateTime createdAt = LocalDateTime.now();
}
