package com.example.sinhvienBE.controller;

import com.example.sinhvienBE.model.Course;
import com.example.sinhvienBE.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Course> getAll() {
        return courseService.getAll();
    }

    @PostMapping
    public Course create(@RequestBody Course course) {
        return courseService.save(course);
    }
    
    
}
