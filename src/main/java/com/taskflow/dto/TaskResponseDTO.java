package com.taskflow.dto;

import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import java.time.LocalDateTime;

/**
 * DTO DE SAÍDA (TaskResponseDTO)
 * 
 * Por que esta classe existe?
 * Desacopla o modelo do banco de dados da visualização da API. Se no futuro
 * decidirmos alterar o nome do campo ou omitir informações confidenciais do
 * banco na resposta HTTP, alteramos apenas este DTO de saída, sem quebrar
 * os contratos já consumidos pelos clientes da API.
 */
public record TaskResponseDTO(
        Long id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDateTime createdAt
) {
    // Construtor de conveniência para mapear uma entidade Task diretamente para o DTO
    public TaskResponseDTO(Task task) {
        this(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getCreatedAt()
        );
    }
}
