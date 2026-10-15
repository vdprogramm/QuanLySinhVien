package com.example.sinhvienBE.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String studentId;
    private String name;
    private String email;
    private String major;
    private String hobby;
    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;
}
