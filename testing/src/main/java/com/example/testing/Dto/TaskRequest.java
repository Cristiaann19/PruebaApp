package com.example.testing.Dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record TaskRequest(
        String title,
        String description,
        LocalDate date,
        LocalTime time,
        String priority,
        String category,
        boolean completed,
        boolean repeat
) {}