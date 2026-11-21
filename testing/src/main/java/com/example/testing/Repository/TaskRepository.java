package com.example.testing.Repository;

import com.example.testing.Model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserEmailOrderByDateAscTimeAsc(String email);

    Optional<Task> findByIdAndUserEmail(Long id, String email);
}