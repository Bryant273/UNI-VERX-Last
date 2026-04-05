package com.univerx.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "announcements")
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String status; // SENT, DRAFT

    @ElementCollection
    @CollectionTable(name = "announcement_audience", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "audience")
    private List<String> audience;

    @ElementCollection
    @CollectionTable(name = "announcement_channels", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "channel")
    private List<String> channels;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    private LocalDateTime sentAt;
    private LocalDateTime createdAt = LocalDateTime.now();
}
