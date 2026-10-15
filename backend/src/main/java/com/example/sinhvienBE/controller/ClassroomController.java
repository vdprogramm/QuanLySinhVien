package com.example.sinhvienBE.controller;

import com.example.sinhvienBE.model.Classroom;
import com.example.sinhvienBE.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    @GetMapping
    public List<Classroom> getAll() {
        return classroomService.getAll();
    }

    @PostMapping
    public Classroom create(@RequestBody Classroom classroom) {
        return classroomService.save(classroom);
    }
}
