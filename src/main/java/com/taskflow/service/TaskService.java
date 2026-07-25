package com.taskflow.service;

import com.taskflow.dto.TaskRequestDTO;
import com.taskflow.dto.TaskResponseDTO;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import com.taskflow.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * CAMADA DE SERVIÇO (Service Layer)
 * 
 * Por que esta camada existe?
 * O Controller deve apenas gerenciar o protocolo HTTP (receber requisições e responder).
 * As regras de negócio complexas, transacionalidade do banco de dados e orquestração de
 * chamadas a repositórios devem residir no Service. Isso facilita testes unitários isolados.
 * 
 * Por que usar injeção via construtor em vez de @Autowired em atributos?
 * A injeção via construtor é a prática recomendada pelo time do Spring porque:
 * 1. Promove imutabilidade (atributos podem ser definidos como final).
 * 2. Facilita testes unitários (não precisamos subir o Spring para instanciar a classe e mockar dependências).
 * 3. Evita dependências ocultas e ciclicidades de forma explícita.
 */
@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> findAll() {
        return taskRepository.findAll().stream()
                .map(TaskResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponseDTO findById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa com ID " + id + " não encontrada."));
        return new TaskResponseDTO(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> findByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream()
                .map(TaskResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponseDTO create(TaskRequestDTO dto) {
        Task task = new Task(
                dto.title(),
                dto.description(),
                dto.status(),
                dto.priority()
        );
        Task savedTask = taskRepository.save(task);
        return new TaskResponseDTO(savedTask);
    }

    @Transactional
    public TaskResponseDTO update(Long id, TaskRequestDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Impossível atualizar: Tarefa com ID " + id + " não encontrada."));
        
        // Atualiza as propriedades da entidade existente
        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setStatus(dto.status());
        task.setPriority(dto.priority());
        
        // O Hibernate detecta o estado "dirty" do objeto monitorado e faz o UPDATE automaticamente no final da transação
        Task updatedTask = taskRepository.save(task);
        return new TaskResponseDTO(updatedTask);
    }

    @Transactional
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Impossível deletar: Tarefa com ID " + id + " não encontrada.");
        }
        taskRepository.deleteById(id);
    }
}
