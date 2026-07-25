package com.taskflow.dto;

import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO DE ENTRADA (TaskRequestDTO)
 * 
 * O que é um DTO (Data Transfer Object)?
 * DTOs são objetos simples de transferência de dados que definem o contrato de entrada
 * e saída da API. Usar DTOs evita o "Over-posting", onde um cliente mal-intencionado 
 * poderia enviar campos indesejados (como o ID ou data de criação) para tentar 
 * forçar a gravação desses campos diretamente na entidade de banco de dados.
 * 
 * Por que usar Java Records?
 * Introduzidos nativamente no Java moderno, Records são imutáveis e dispensam
 * a escrita de getters, setters, equals, hashCode e toString.
 */
public record TaskRequestDTO(
        
        @NotBlank(message = "O título da tarefa não pode estar em branco")
        @Size(max = 100, message = "O título deve ter no máximo 100 caracteres")
        String title,

        String description,

        @NotNull(message = "O status da tarefa é obrigatório")
        TaskStatus status,

        @NotNull(message = "A prioridade da tarefa é obrigatória")
        TaskPriority priority
) {
}
