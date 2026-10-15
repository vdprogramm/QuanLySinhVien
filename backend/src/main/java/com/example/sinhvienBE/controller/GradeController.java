package com.example.sinhvienBE.controller;

import com.example.sinhvienBE.model.Grade;
import com.example.sinhvienBE.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin

public class GradeController {

    @Autowired
    private GradeService gradeService;  

    @GetMapping
    public List<Grade> getAll() {
        return gradeService.getAll();
    }

    @PostMapping
    public Grade create(@RequestBody Grade grade) {
        return gradeService.save(grade);
    }
}
