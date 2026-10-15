package com.example.sinhvienBE.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Grade {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;
    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;
    private Double grade;
}
