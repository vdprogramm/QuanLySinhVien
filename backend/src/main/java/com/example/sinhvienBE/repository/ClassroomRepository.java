package com.example.sinhvienBE.repository;

import com.example.sinhvienBE.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    boolean existsByCode(String code);
}
