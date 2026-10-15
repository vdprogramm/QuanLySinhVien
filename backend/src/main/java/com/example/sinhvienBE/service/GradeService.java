package com.example.sinhvienBE.service;

import com.example.sinhvienBE.model.Grade;
import com.example.sinhvienBE.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {
    @Autowired
    private GradeRepository gradeRepository;

    public List<Grade> getAll() {
        return gradeRepository.findAll();
    }

    public Grade save(Grade grade) {
        return gradeRepository.save(grade);
    }
}
