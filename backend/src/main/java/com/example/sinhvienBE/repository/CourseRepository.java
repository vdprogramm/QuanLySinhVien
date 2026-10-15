package com.example.sinhvienBE.repository;

import com.example.sinhvienBE.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    List<Course> findByLecturer_Id(Long lecturerId);
}
