package com.univerx.controller;

import com.univerx.model.AiAlert;
import com.univerx.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/business/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @GetMapping("/alerts/user/{id}")
    public List<AiAlert> getUserAlerts(@PathVariable Long id) {
        return aiService.getAlertsForUser(id);
    }

    @GetMapping("/alerts/user/{id}/unread")
    public List<AiAlert> getUnread(@PathVariable Long id) {
        return aiService.getUnreadAlerts(id);
    }

    @PutMapping("/alerts/{id}/read")
    public AiAlert markRead(@PathVariable Long id) {
        return aiService.markAsRead(id);
    }

    @PostMapping("/alerts")
    public AiAlert postAlert(@RequestBody AiAlert alert) {
        return aiService.createAlert(alert);
    }
}
