package com.example.sinhvienBE.repository;

import com.example.sinhvienBE.model.Grade;
import org.springframework.data.jpa.repository.*;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    @Query("SELECT AVG(g.grade) FROM Grade g")
    Double getAverageGrade();
    Optional<Grade> findByStudent_IdAndCourse_Id(Long studentId, Long courseId);
}
