package com.example.sinhvienBE.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String code;
    private String name;
    private String description;
    @ManyToOne
    @JoinColumn(name = "lecturer_id")
    private UserAccount lecturer;
}
