package com.example.testing.Controller;

import com.example.testing.Model.Task;
import com.example.testing.Service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
@Tag(name = "Tasks", description = "Operaciones para gestionar las tareas de Taskly")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @Operation(summary = "Listar todas las tareas", description = "Devuelve todas las tareas ordenadas por fecha y hora.")
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Obtener una tarea por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Crear una nueva tarea")
    @ApiResponse(responseCode = "201", description = "Tarea creada correctamente")
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        // Devuelve código 201 CREATED con la tarea recién guardada
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @Operation(summary = "Actualizar una tarea existente")
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(id, taskDetails);
        return ResponseEntity.ok(updatedTask);
    }

    @Operation(summary = "Alternar completada / pendiente")
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggleTask(@PathVariable Long id) {
        Task toggledTask = taskService.toggleTaskCompleted(id);
        return ResponseEntity.ok(toggledTask);
    }

    @Operation(summary = "Eliminar una tarea")
    @ApiResponse(responseCode = "204", description = "Tarea eliminada correctamente")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}