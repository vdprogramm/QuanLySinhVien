package com.example.sinhvienBE.controller;

import com.example.sinhvienBE.model.*;
import com.example.sinhvienBE.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/api/lecturer")
public class LecturerPortalController {
    private final UserAccountRepository users;
    private final CourseRepository courses;
    private final EnrollmentRepository enrollments;
    private final GradeRepository grades;
    public LecturerPortalController(UserAccountRepository users,CourseRepository courses,EnrollmentRepository enrollments,GradeRepository grades){
        this.users=users;this.courses=courses;this.enrollments=enrollments;this.grades=grades;
    }
    private Long lecturerId(Authentication auth) {
        return users.findByUsername(auth.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED)).getId();
    }
    private Course owned(Long courseId,Authentication auth) {
        var course=courses.findById(courseId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(course.getLecturer()==null || !course.getLecturer().getId().equals(lecturerId(auth)))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Không phụ trách môn này");
        return course;
    }
    @GetMapping("/courses")
    public List<Course> courses(Authentication auth){return courses.findByLecturer_Id(lecturerId(auth));}
    @GetMapping("/courses/{id}/enrollments")
    public List<Enrollment> roster(@PathVariable Long id,Authentication auth){
        owned(id,auth);
        return enrollments.findByCourse_Id(id);
    }
    public record GradeInput(@NotNull Long studentId,@NotNull @DecimalMin("0.0") @DecimalMax("10.0") Double grade) {}
    @PutMapping("/courses/{id}/grades")
    public Grade mark(@PathVariable Long id,Authentication auth,@Valid @RequestBody GradeInput input){
        Course course=owned(id,auth);
        if(!enrollments.existsByStudent_IdAndCourse_Id(input.studentId(),id))
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Sinh viên chưa đăng ký môn");
        Grade grade=grades.findByStudent_IdAndCourse_Id(input.studentId(),id).orElseGet(Grade::new);
        var enrollment=enrollments.findByStudent_IdAndCourse_Id(input.studentId(),id).orElseThrow();
        grade.setStudent(enrollment.getStudent());grade.setCourse(course);grade.setGrade(input.grade());
        return grades.save(grade);
    }
}
