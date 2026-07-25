package com.taskflow.model;

/**
 * ENUM PARA STATUS DA TAREFA (TaskStatus)
 * 
 * Por que usar Enums?
 * O uso de Enums garante type safety (segurança de tipos) e impede a inserção de 
 * valores arbitrários inválidos (como "ABERTO", "FAZENDO", etc.) no banco de dados. 
 * Mapeamos como STRING no Hibernate para manter o banco de dados legível, 
 * evitando "números mágicos" (ex: 0, 1, 2) que dificultam consultas SQL diretas.
 */
public enum TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED
}
