package com.example.sinhvienBE.controller;

import com.example.sinhvienBE.dto.ReportDTO;
import com.example.sinhvienBE.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin
public class ReportController {

    @Autowired private StudentRepository studentRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private ClassroomRepository classRepository;
    @Autowired private GradeRepository gradeRepository;

    @GetMapping("/summary")
    public ReportDTO getSummaryReport() {
        long totalStudents = studentRepository.count();
        long totalCourses = courseRepository.count();
        long totalClasses = classRepository.count();

        Double averageGrade = gradeRepository.getAverageGrade();
        if (averageGrade == null) averageGrade = 0.0;

        return new ReportDTO(totalStudents, totalCourses, totalClasses, averageGrade);
    }
}
