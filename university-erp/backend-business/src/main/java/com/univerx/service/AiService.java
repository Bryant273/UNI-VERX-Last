package com.univerx.service;

import com.univerx.model.AiAlert;
import com.univerx.model.AiStudentPerformance;
import com.univerx.repository.AiAlertRepository;
import com.univerx.repository.AiStudentPerformanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AiService {
    @Autowired
    private AiAlertRepository aiAlertRepository;
    
    @Autowired
    private AiStudentPerformanceRepository performanceRepository;

    public List<AiAlert> getAlertsForUser(Long userId) {
        return aiAlertRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    public List<AiAlert> getUnreadAlerts(Long userId) {
        return aiAlertRepository.findByReceiverIdAndIsReadFalse(userId);
    }

    public AiAlert markAsRead(Long alertId) {
        AiAlert alert = aiAlertRepository.findById(alertId).orElseThrow();
        alert.setIsRead(true);
        return aiAlertRepository.save(alert);
    }

    public AiAlert createAlert(AiAlert alert) {
        return aiAlertRepository.save(alert);
    }

    public AiStudentPerformance updatePerformance(Long studentId, Double gpa, Double attendance) {
        AiStudentPerformance performance = performanceRepository.findByStudentId(studentId)
            .orElseGet(() -> {
                AiStudentPerformance p = new AiStudentPerformance();
                // Note: Logic to link student User entity would go here
                return p;
            });
        performance.setAverageGrade(gpa);
        performance.setAttendanceRate(attendance);
        return performanceRepository.save(performance);
    }
}
