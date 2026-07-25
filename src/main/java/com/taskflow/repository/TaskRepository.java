package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * CAMADA DE PERSISTÊNCIA (Repository Layer)
 * 
 * Por que esta interface estende JpaRepository?
 * Ao estender JpaRepository<Task, Long>, o Spring Data JPA gera automaticamente em
 * tempo de execução todas as operações CRUD básicas (save, findById, findAll, delete, etc.)
 * sem a necessidade de escrever uma única linha de SQL ou código de implementação.
 * 
 * O que são Query Methods?
 * O Spring analisa a assinatura de métodos como "findByStatus" e cria a consulta SQL
 * automaticamente (ex: SELECT * FROM tb_tasks WHERE status = ?).
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Query Method customizado para filtrar tarefas por status
    List<Task> findByStatus(TaskStatus status);
}
