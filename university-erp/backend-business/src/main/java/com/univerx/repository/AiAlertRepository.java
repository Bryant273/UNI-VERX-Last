package com.univerx.repository;

import com.univerx.model.AiAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiAlertRepository extends JpaRepository<AiAlert, Long> {
    List<AiAlert> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    List<AiAlert> findByReceiverIdAndIsReadFalse(Long receiverId);
}
