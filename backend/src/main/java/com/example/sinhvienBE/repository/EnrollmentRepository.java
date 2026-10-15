package com.example.sinhvienBE.repository;

import com.example.sinhvienBE.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudent_IdAndCourse_Id(Long studentId, Long courseId);
    List<Enrollment> findByStudent_Id(Long studentId);
    List<Enrollment> findByCourse_Id(Long courseId);
    Optional<Enrollment> findByStudent_IdAndCourse_Id(Long studentId, Long courseId);
}
