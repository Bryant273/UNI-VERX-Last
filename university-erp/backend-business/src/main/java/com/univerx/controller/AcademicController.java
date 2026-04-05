package com.univerx.controller;

import com.univerx.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/academic")
public class AcademicController {
    @Autowired
    private GradeService gradeService;

    @GetMapping("/student/{studentId}/metrics")
    public Map<String, Object> getStudentMetrics(@PathVariable Long studentId) {
        return Map.of(
            "studentId", studentId,
            "gpa", gradeService.calculateGPA(studentId),
            "acquiredCredits", gradeService.calculateAcquiredCredits(studentId)
        );
    }
}
