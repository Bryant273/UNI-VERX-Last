package com.univerx.controller;

import com.univerx.model.Course;
import com.univerx.service.CourseService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/business/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    @RateLimiter(name = "default")
    @CircuitBreaker(name = "default", fallbackMethod = "fallbackGetAll")
    public List<Course> getAll() {
        return courseService.getAllCourses();
    }

    public List<Course> fallbackGetAll(Throwable t) {
        return Collections.emptyList();
    }

    @PostMapping
    public Course create(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }
}
