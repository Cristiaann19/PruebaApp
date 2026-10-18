
package com.example.testing.config;

import com.example.testing.Model.Task;
import com.example.testing.Repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TaskRepository taskRepository;

    public DataInitializer(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {

        if (taskRepository.count() == 0) {

            LocalDate today = LocalDate.now();
            LocalDate tomorrow = today.plusDays(1);

            Task t1 = createSampleTask(
                    "Estudiar para el examen de Sistemas",
                    "Repasar arquitectura cliente-servidor y bases de datos",
                    today,
                    LocalTime.of(18, 0),
                    "Alta",
                    "Estudio",
                    false
            );

            Task t2 = createSampleTask(
                    "Enviar avance del proyecto",
                    "Subir repositorio con el backend en Spring Boot",
                    today,
                    LocalTime.of(11, 30),
                    "Alta",
                    "Trabajo",
                    true
            );

            Task t3 = createSampleTask(
                    "Ir al gimnasio",
                    "Rutina de fuerza y cardio",
                    tomorrow,
                    LocalTime.of(7, 0),
                    "Media",
                    "Personal",
                    false
            );

            Task t4 = createSampleTask(
                    "Comprar víveres",
                    "Frutas, avena y café para la semana",
                    tomorrow,
                    LocalTime.of(19, 0),
                    "Baja",
                    "General",
                    false
            );

            Task t5 = createSampleTask(
                    "Planificar la semana",
                    "Organizar horarios de clases y entregas",
                    today,
                    LocalTime.of(9, 0),
                    "Baja",
                    "Personal",
                    true
            );

            taskRepository.saveAll(List.of(t1, t2, t3, t4, t5));

            System.out.println(
                    "Taskly: 5 tareas iniciales guardadas en MySQL."
            );

        } else {
            System.out.println(
                    "Taskly: La base de datos ya contiene tareas guardadas."
            );
        }
    }

    private Task createSampleTask(
            String title,
            String description,
            LocalDate date,
            LocalTime time,
            String priority,
            String category,
            boolean completed
    ) {

        Task task = new Task();

        task.setTitle(title);
        task.setDescription(description);
        task.setDate(date);
        task.setTime(time);
        task.setPriority(priority);
        task.setCategory(category);
        task.setCompleted(completed);
        task.setRepeat(false);

        return task;
    }
}
