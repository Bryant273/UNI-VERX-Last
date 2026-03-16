package com.univerx.controller;

import com.univerx.model.Course;
import com.univerx.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/business/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Course> getAll() {
        return courseService.getAllCourses();
    }

    @PostMapping
    public Course create(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }
}
