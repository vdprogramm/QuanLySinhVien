package com.example.sinhvienBE.controller;

import com.example.sinhvienBE.model.*;
import com.example.sinhvienBE.repository.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/api/student")
public class StudentPortalController {
    private final UserAccountRepository users;
    private final EnrollmentRepository enrollments;
    private final CourseRepository courses;
    private final GradeRepository grades;
    public StudentPortalController(UserAccountRepository users,EnrollmentRepository enrollments,CourseRepository courses,GradeRepository grades){
        this.users=users;this.enrollments=enrollments;this.courses=courses;this.grades=grades;
    }
    private Student current(Authentication auth){
        var user=users.findByUsername(auth.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if(user.getStudent()==null) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Chưa liên kết hồ sơ sinh viên");
        return user.getStudent();
    }
    @GetMapping("/profile")
    public Student profile(Authentication auth){ return current(auth); }
    @GetMapping("/enrollments")
    public List<Enrollment> enrollments(Authentication auth){return enrollments.findByStudent_Id(current(auth).getId());}
    public record CourseRegistration(Long courseId){}
    @PostMapping("/enrollments")
    @ResponseStatus(HttpStatus.CREATED)
    public Enrollment enroll(Authentication auth,@RequestBody CourseRegistration input){
        if(input.courseId()==null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        var student=current(auth);
        var course=courses.findById(input.courseId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(enrollments.existsByStudent_IdAndCourse_Id(student.getId(),course.getId()))
             throw new ResponseStatusException(HttpStatus.CONFLICT,"Đã đăng ký môn này");
        return enrollments.save(new Enrollment(student,course));
    }
    @GetMapping("/grades")
    public List<Grade> myGrades(Authentication auth){
        Long studentId=current(auth).getId();
        return grades.findAll().stream().filter(g->g.getStudent().getId().equals(studentId)).toList();
    }
}
