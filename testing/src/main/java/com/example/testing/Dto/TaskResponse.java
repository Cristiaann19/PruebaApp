package com.example.testing.Dto;

import com.example.testing.Model.Task;

import java.time.LocalDate;
import java.time.LocalTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        LocalDate date,
        LocalTime time,
        String priority,
        String category,
        boolean completed,
        boolean repeat
) {
    public static TaskResponse from(Task t) {
        return new TaskResponse(
                t.getId(), t.getTitle(), t.getDescription(), t.getDate(),
                t.getTime(), t.getPriority(), t.getCategory(),
                t.isCompleted(), t.isRepeat()
        );
    }
}