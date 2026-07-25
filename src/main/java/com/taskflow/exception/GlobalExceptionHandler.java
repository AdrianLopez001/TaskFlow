package com.taskflow.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * TRATADOR GLOBAL DE EXCEÇÕES (GlobalExceptionHandler)
 * 
 * Por que esta classe existe?
 * Em uma API RESTful, nunca devemos deixar exceções cruas (stacktraces) vazarem para
 * o cliente final por motivos de segurança e experiência do usuário.
 * O @RestControllerAdvice intercepta exceções lançadas em qualquer Controller
 * e as traduz em respostas JSON padronizadas com o código HTTP adequado.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Record interno para representar a estrutura padrão de erro da API
    public record StandardError(
            LocalDateTime timestamp,
            int status,
            String error,
            String message,
            String path
    ) {}

    // Record interno para representar erros de validação de formulários
    public record ValidationError(
            LocalDateTime timestamp,
            int status,
            String error,
            String message,
            String path,
            Map<String, String> fieldErrors
    ) {}

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> entityNotFound(ResourceNotFoundException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        StandardError err = new StandardError(
                LocalDateTime.now(),
                status.value(),
                "Resource Not Found",
                e.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> validation(MethodArgumentNotValidException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        Map<String, String> errors = new HashMap<>();
        
        for (FieldError f : e.getBindingResult().getFieldErrors()) {
            errors.put(f.getField(), f.getDefaultMessage());
        }

        ValidationError err = new ValidationError(
                LocalDateTime.now(),
                status.value(),
                "Validation Error",
                "Erro de validação nos campos informados",
                request.getRequestURI(),
                errors
        );
        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardError> genericException(Exception e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        StandardError err = new StandardError(
                LocalDateTime.now(),
                status.value(),
                "Internal Server Error",
                "Ocorreu um erro inesperado no servidor: " + e.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(err);
    }
}
