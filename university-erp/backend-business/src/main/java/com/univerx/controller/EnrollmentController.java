package com.univerx.controller;

import com.univerx.model.Enrollment;
import com.univerx.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/business/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public List<Enrollment> getAll() {
        return enrollmentService.getAllEnrollments();
    }

    @PostMapping
    public Enrollment create(@RequestBody Enrollment enrollment) {
        return enrollmentService.saveEnrollment(enrollment);
    }

    @GetMapping("/student/{id}")
    public List<Enrollment> getByStudent(@PathVariable Long id) {
        return enrollmentService.getStudentEnrollments(id);
    }
}
