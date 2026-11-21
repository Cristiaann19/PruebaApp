package com.example.testing.config;

import com.example.testing.Model.Task;
import com.example.testing.Model.User;
import com.example.testing.Repository.TaskRepository;
import com.example.testing.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DataInitializer(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {

        if (taskRepository.count() > 0) {
            System.out.println("Taskly: La base de datos ya contiene tareas guardadas.");
            return;
        }

        User ana = userRepository.findByEmail("ana@taskly.com").orElse(null);
        User luis = userRepository.findByEmail("luis@taskly.com").orElse(null);

        if (ana == null || luis == null) {
            System.out.println("Taskly: No se crearon tareas de ejemplo. "
                    + "Ejecuta database/seed_users.sql primero.");
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        // Tareas de Ana
        Task t1 = createSampleTask(ana,
                "Estudiar para el examen de Sistemas",
                "Repasar arquitectura cliente-servidor y bases de datos",
                today, LocalTime.of(18, 0), "Alta", "Estudio", false);

        Task t2 = createSampleTask(ana,
                "Enviar avance del proyecto",
                "Subir repositorio con el backend en Spring Boot",
                today, LocalTime.of(11, 30), "Alta", "Trabajo", true);

        Task t3 = createSampleTask(ana,
                "Ir al gimnasio",
                "Rutina de fuerza y cardio",
                tomorrow, LocalTime.of(7, 0), "Media", "Personal", false);

        // Tareas de Luis
        Task t4 = createSampleTask(luis,
                "Comprar víveres",
                "Frutas, avena y café para la semana",
                tomorrow, LocalTime.of(19, 0), "Baja", "General", false);

        Task t5 = createSampleTask(luis,
                "Planificar la semana",
                "Organizar horarios de clases y entregas",
                today, LocalTime.of(9, 0), "Baja", "Personal", true);

        taskRepository.saveAll(List.of(t1, t2, t3, t4, t5));

        System.out.println("Taskly: 5 tareas iniciales guardadas (3 para Ana, 2 para Luis).");
    }

    private Task createSampleTask(
            User user,
            String title,
            String description,
            LocalDate date,
            LocalTime time,
            String priority,
            String category,
            boolean completed
    ) {
        Task task = new Task();
        task.setUser(user);
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