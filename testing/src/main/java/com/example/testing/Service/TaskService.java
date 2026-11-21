package com.example.testing.Service;

import com.example.testing.Dto.TaskRequest;
import com.example.testing.Model.Task;
import com.example.testing.Model.User;
import com.example.testing.Repository.TaskRepository;
import com.example.testing.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Task> getAllTasks(String email) {
        return taskRepository.findByUserEmailOrderByDateAscTimeAsc(email);
    }

    public Task getTaskById(Long id, String email) {
        return taskRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tarea no encontrada"));
    }

    @Transactional
    public Task createTask(TaskRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));

        Task task = new Task();
        apply(task, req);
        task.setUser(user);
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, TaskRequest req, String email) {
        Task task = getTaskById(id, email);
        apply(task, req);
        return taskRepository.save(task);
    }

    @Transactional
    public Task toggleTaskCompleted(Long id, String email) {
        Task task = getTaskById(id, email);
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id, String email) {
        Task task = getTaskById(id, email);
        taskRepository.delete(task);
    }

    private void apply(Task task, TaskRequest req) {
        task.setTitle(req.title());
        task.setDescription(req.description());
        task.setDate(req.date());
        task.setTime(req.time());
        task.setPriority(req.priority());
        task.setCategory(req.category());
        task.setCompleted(req.completed());
        task.setRepeat(req.repeat());
    }
}