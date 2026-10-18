package com.example.testing.Model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Column(nullable = false)
    private String priority; // "Baja", "Media", "Alta"

    @Column(nullable = false)
    private String category; // "General", "Estudio", "Trabajo", "Personal"

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "is_repeat", nullable = false)
    private boolean repeat;
}
