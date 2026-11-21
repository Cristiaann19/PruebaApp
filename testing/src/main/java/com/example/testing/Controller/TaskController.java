package com.example.testing.Controller;

import com.example.testing.Dto.TaskRequest;
import com.example.testing.Dto.TaskResponse;
import com.example.testing.Service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @Operation(summary = "Listar mis tareas", description = "Devuelve las tareas del usuario autenticado ordenadas por fecha y hora.")
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication auth) {
        List<TaskResponse> tasks = taskService.getAllTasks(auth.getName())
                .stream().map(TaskResponse::from).toList();
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Obtener una de mis tareas por ID")
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(TaskResponse.from(taskService.getTaskById(id, auth.getName())));
    }

    @Operation(summary = "Crear una nueva tarea")
    @ApiResponse(responseCode = "201", description = "Tarea creada correctamente")
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest request, Authentication auth) {
        TaskResponse created = TaskResponse.from(taskService.createTask(request, auth.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Actualizar una tarea existente")
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            Authentication auth) {
        return ResponseEntity.ok(TaskResponse.from(taskService.updateTask(id, request, auth.getName())));
    }

    @Operation(summary = "Alternar completada / pendiente")
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskResponse> toggleTask(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(TaskResponse.from(taskService.toggleTaskCompleted(id, auth.getName())));
    }

    @Operation(summary = "Eliminar una tarea")
    @ApiResponse(responseCode = "204", description = "Tarea eliminada correctamente")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication auth) {
        taskService.deleteTask(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}