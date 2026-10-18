package com.example.testing.Service;

import com.example.testing.Model.Task;
import com.example.testing.Repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByDateAscTimeAsc();
    }


    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró la tarea con el ID: " + id));
    }


    public Task createTask(Task task) {
        // Regla de negocio: limpiamos espacios extra en el título
        if (task.getTitle() != null) {
            task.setTitle(task.getTitle().trim());
        }
        return taskRepository.save(task);
    }


    public Task updateTask(Long id, Task taskDetails) {
        Task existingTask = getTaskById(id);

        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setDate(taskDetails.getDate());
        existingTask.setTime(taskDetails.getTime());
        existingTask.setPriority(taskDetails.getPriority());
        existingTask.setCategory(taskDetails.getCategory());
        existingTask.setCompleted(taskDetails.isCompleted());
        existingTask.setRepeat(taskDetails.isRepeat());

        return taskRepository.save(existingTask);
    }

    public Task toggleTaskCompleted(Long id) {
        Task existingTask = getTaskById(id);
        existingTask.setCompleted(!existingTask.isCompleted());
        return taskRepository.save(existingTask);
    }


    public void deleteTask(Long id) {
        Task existingTask = getTaskById(id);
        taskRepository.delete(existingTask);
    }
}