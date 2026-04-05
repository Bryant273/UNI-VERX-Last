package com.univerx.controller;

import com.univerx.model.Grade;
import com.univerx.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/business/grades")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @GetMapping
    public List<Grade> getAll() {
        return gradeService.getAllGrades();
    }

    @PostMapping
    public Grade create(@RequestBody Grade grade) {
        return gradeService.saveGrade(grade);
    }

    @GetMapping("/student/{id}")
    public List<Grade> getByStudent(@PathVariable Long id) {
        return gradeService.getStudentGrades(id);
    }
}
