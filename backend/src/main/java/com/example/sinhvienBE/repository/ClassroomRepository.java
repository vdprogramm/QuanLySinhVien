package com.example.sinhvienBE.repository;

import com.example.sinhvienBE.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    Optional<Classroom> findByCode(String code);
}
