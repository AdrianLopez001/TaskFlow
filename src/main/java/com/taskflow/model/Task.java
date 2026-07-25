package com.taskflow.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * ENTIDADE JPA (Task Entity)
 * 
 * Por que esta classe é anotada com @Entity?
 * O @Entity define que essa classe Java representa uma tabela no banco de dados.
 * O Hibernate (implementação padrão do JPA no Spring) mapeará os atributos desta 
 * classe em colunas da tabela.
 * 
 * Por que usar @Table(name = "tb_tasks")?
 * A palavra "TASK" é uma palavra reservada em muitos sistemas de banco de dados (SGBDs).
 * Usar um prefixo como "tb_" ou um nome explícito evita erros de sintaxe SQL em tempo de execução.
 */
@Entity
@Table(name = "tb_tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // CONSTRUTOR PADRÃO (Obrigatório para o JPA/Hibernate)
    public Task() {
    }

    // CONSTRUTOR COMPLETO
    public Task(String title, String description, TaskStatus status, TaskPriority priority) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
    }

    // GETTERS E SETTERS (Contrato para acesso e alteração das colunas da tabela)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
