package com.kaiburr.taskmanager.service;

import com.kaiburr.taskmanager.model.Task;
import com.kaiburr.taskmanager.model.TaskExecution;
import com.kaiburr.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> findAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> findTaskById(String id) {
        return taskRepository.findById(id);
    }

    public List<Task> findTasksByName(String name) {
        return taskRepository.findByNameContaining(name);
    }

    public Task saveTask(Task task) {
        // Simple command validation
        String command = task.getCommand();
        if (command.contains(";") || command.contains("&&") || command.contains("||") || command.contains("|") || command.contains("`")) {
            throw new IllegalArgumentException("Invalid characters in command");
        }
        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    public Task executeTask(String id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        TaskExecution execution = new TaskExecution();
        execution.setStartTime(new Date());

        try {
            Process process = Runtime.getRuntime().exec(task.getCommand());
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            process.waitFor();
            execution.setOutput(output.toString());
        } catch (Exception e) {
            execution.setOutput(e.getMessage());
        }

        execution.setEndTime(new Date());

        if (task.getTaskExecutions() == null) {
            task.setTaskExecutions(new ArrayList<>());
        }
        task.getTaskExecutions().add(execution);

        return taskRepository.save(task);
    }
}
