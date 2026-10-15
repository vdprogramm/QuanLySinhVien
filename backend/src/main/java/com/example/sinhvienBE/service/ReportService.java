// src/main/java/com/example/sinhvienBE/service/ReportService.java
package com.example.sinhvienBE.service;

import com.example.sinhvienBE.dto.ReportDTO;
import com.example.sinhvienBE.repository.ClassroomRepository;
import com.example.sinhvienBE.repository.CourseRepository;
import com.example.sinhvienBE.repository.GradeRepository;
import com.example.sinhvienBE.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ClassroomRepository classRepository;

    @Autowired
    private GradeRepository gradeRepository;

    public ReportDTO getSummary() {
        long totalStudents = studentRepository.count();
        long totalCourses = courseRepository.count();
        long totalClasses = classRepository.count();
        Double avgGrade = gradeRepository.getAverageGrade();
        double averageGrade = avgGrade != null ? avgGrade : 0.0;

        return new ReportDTO(totalStudents, totalCourses, totalClasses, averageGrade);
    }
}
