package com.taskflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * CONTROLLER DE TESTE INICIAL (HelloController)
 * 
 * Por que este controller existe?
 * Ele serve para validar se o Spring Boot subiu corretamente e se a comunicação
 * HTTP está funcionando antes de configurarmos conexões com o banco de dados.
 */
@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello World! O TaskFlow está rodando com sucesso.";
    }
}
