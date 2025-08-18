package com.example.sinhvienBE.service;

import com.example.sinhvienBE.model.Classroom;
import com.example.sinhvienBE.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {
    @Autowired
    private ClassroomRepository classroomRepository;

    public List<Classroom> getAll() {
        return classroomRepository.findAll();
    }

    public Classroom save(Classroom classroom) {
        return classroomRepository.save(classroom);
    }
}
