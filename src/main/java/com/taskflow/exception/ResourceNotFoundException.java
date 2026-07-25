package com.taskflow.exception;

/**
 * EXCEÇÃO DE NEGÓCIO (ResourceNotFoundException)
 * 
 * Por que criar exceções customizadas?
 * Lançar exceções específicas do domínio (como ResourceNotFoundException) torna as
 * regras de negócio do Service mais expressivas e fáceis de ler.
 * O GlobalExceptionHandler irá capturar esta exceção específica para retornar o status
 * HTTP 404 Not Found ao cliente da API.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
