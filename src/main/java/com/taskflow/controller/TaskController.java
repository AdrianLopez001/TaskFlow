package com.taskflow.controller;

import com.taskflow.dto.TaskRequestDTO;
import com.taskflow.dto.TaskResponseDTO;
import com.taskflow.model.TaskStatus;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER REST (TaskController)
 * 
 * Por que esta camada existe?
 * O Controller REST expõe as portas de entrada da nossa API (endpoints) para clientes
 * externos (como nosso frontend, dispositivos móveis ou outras APIs).
 * Ele mapeia as rotas HTTP e converte os dados JSON recebidos em DTOs utilizáveis
 * pelo Java, além de definir os códigos de status HTTP corretos na resposta.
 * 
 * O que é a anotação @CrossOrigin?
 * Habilita a política de CORS (Cross-Origin Resource Sharing). Como o nosso frontend
 * Vanilla/TS rodará localmente (em portas como 5500 ou direto no arquivo local) e
 * a API rodará na porta 8080, o navegador bloquearia requisições se não permitíssemos 
 * explicitamente origens cruzadas.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // Permite requisições de qualquer origem (essencial para testes locais)
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks(@RequestParam(required = false) TaskStatus status) {
        List<TaskResponseDTO> tasks;
        if (status != null) {
            tasks = taskService.findByStatus(status);
        } else {
            tasks = taskService.findAll();
        }
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id) {
        TaskResponseDTO task = taskService.findById(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskRequestDTO dto) {
        TaskResponseDTO createdTask = taskService.create(dto);
        // Retorna HTTP 201 Created para operações de inserção bem-sucedidas
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequestDTO dto) {
        TaskResponseDTO updatedTask = taskService.update(id, dto);
        // Retorna HTTP 200 OK para atualizações
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.delete(id);
        // Retorna HTTP 204 No Content para exclusões (resposta sem corpo de conteúdo)
        return ResponseEntity.noContent().build();
    }
}
