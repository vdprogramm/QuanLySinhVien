package com.example.sinhvienBE.repository;

import com.example.sinhvienBE.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    // có thể thêm các truy vấn nâng cao sau
     @Query("SELECT AVG(g.grade) FROM Grade g")
    Double getAverageGrade();
}
