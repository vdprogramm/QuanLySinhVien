package com.example.sinhvienBE.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "enrollments", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Getter @Setter @NoArgsConstructor
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "student_id")
    private Student student;
    @ManyToOne(optional = false) @JoinColumn(name = "course_id")
    private Course course;
    public Enrollment(Student student, Course course) {
        this.student = student;
        this.course = course;
    }
}
