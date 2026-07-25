# TaskFlow: Trilha de Aprendizagem Full Stack (Júnior/Pleno)

Bem-vindo ao **TaskFlow**! Este repositório foi construído de forma incremental e didática para servir como um manual prático e de referência sobre engenharia de software no ecossistema **Java/Spring Boot** e **TypeScript**.

O foco principal é ensinar como estruturar uma aplicação backend robusta, desacoplar contratos usando DTOs, lidar com persistência, tratar exceções de forma global, empacotar e orquestrar serviços com **Docker** e construir um frontend dinâmico do zero.

---

## 🏗️ Ciclo de Vida da Requisição (Arquitetura)

O diagrama abaixo ilustra o fluxo de dados desde o clique do usuário no navegador até a persistência no banco de dados relacional:

```
 1. Usuário clica em "Salvar Tarefa" no Browser (TypeScript / Fetch)
                          │
                          ▼ (HTTP POST /api/tasks com JSON no Body)
 2. Spring Web Container (Tomcat embutido) recebe a requisição
                          │
                          ▼
 3. TaskController intercepta, valida o TaskRequestDTO (@Valid)
                          │
                          ▼
 4. TaskService aplica regras de negócio e converte DTO para Entity Task
                          │
                          ▼
 5. TaskRepository executa comando SQL de inserção (INSERT INTO tb_tasks...)
                          │
                          ▼
 6. PostgreSQL armazena o registro e devolve o ID gerado
                          │
                          ▼
 7. Resposta sobe em cascata convertida para TaskResponseDTO com Status 201 Created
```

---

## 📚 Conceitos Ensinados por Camada

### 1. Backend: Java 21 & Spring Boot 3.x

* **Entidade JPA (`com.taskflow.model.Task`)**: Mapeamento Objeto-Relacional (ORM) usando Hibernate. Ensina o ciclo de vida dos objetos no banco de dados, o uso de `@Table` para evitar conflito com palavras reservadas, `@Enumerated(EnumType.STRING)` para salvar enums legíveis e `@CreationTimestamp` para auditoria automática.
* **Repositório (`com.taskflow.repository.TaskRepository`)**: O padrão Repository estendendo `JpaRepository`. Mostra como o Spring Data traduz assinaturas de métodos (Query Methods como `findByStatus`) diretamente em consultas SQL preparadas.
* **DTOs (`com.taskflow.dto`)**: Uso de Java Records para `TaskRequestDTO` e `TaskResponseDTO`. Explica a mitigação de ataques de *Over-posting* e o desacoplamento necessário entre o contrato exposto na API e as colunas físicas do banco.
* **Validação de Entrada**: Utilização do Bean Validation (`@NotBlank`, `@NotNull`, `@Size`) para validar requisições antes que atinjam o serviço de negócio.
* **Serviço (`com.taskflow.service.TaskService`)**: Isolamento total de regras de negócio, demarcação transacional com `@Transactional` e injeção de dependências via construtor (evitando `@Autowired` em campos, facilitando testes e garantindo imutabilidade).
* **Tratamento de Exceções (`com.taskflow.exception`)**: Criação de exceções customizadas (`ResourceNotFoundException`) capturadas de forma centralizada por um `@RestControllerAdvice`, impedindo o vazamento de stacktraces e devolvendo payloads JSON padronizados.

### 2. Frontend: Do JavaScript ao TypeScript Moderno

* **Vanilla JS (`fetch` API)**: Como realizar requisições assíncronas com tratamento de erros, manipulação direta do DOM, conversão de JSON e atualização dinâmica de contadores locais.
* **Migração TypeScript**: Introdução de tipagem estática e interfaces (`types.ts`) para eliminar erros comuns em tempo de execução. Compilação modular de arquivos (`ESNext`) sem necessidade de instaladores complexos de empacotamento.

### 3. DevOps e Infraestrutura: Ambiente Agnóstico

* **Dockerfile Multi-Stage**: Separa a fase de compilação (JDK + dependências Maven completas) da fase de execução (JRE leve). O resultado é uma imagem final Docker compacta e com menor superfície para vulnerabilidades.
* **Docker Compose**: Orquestração contendo o banco PostgreSQL e a API. Utiliza `healthcheck` no Postgres e `depends_on (service_healthy)` na API para garantir que o backend inicie somente após o banco estar pronto para conexões.

---

## 🚀 Como Executar o Projeto

Você tem duas formas de rodar a aplicação:

### Método 1: Via Docker Compose (Mais Recomendado)

Certifique-se de ter o Docker e Docker Compose instalados na sua máquina.

1. No diretório raiz do projeto, execute:
   ```bash
   docker compose up --build
   ```
2. O banco PostgreSQL e a API Spring Boot subirão automaticamente.
3. Acesse o endpoint de Hello World para testar o backend:
   ```
   http://localhost:8080/api/hello
   ```
4. Abra o arquivo `frontend/index.html` em um navegador (de preferência servido por um servidor estático local, como o Live Server do VS Code, para evitar bloqueios CORS de arquivos locais).

---

### Método 2: Rodando Localmente (Sem Docker)

#### Requisitos:
* Java 21 instalado.
* Banco PostgreSQL rodando localmente na porta 5432 com um schema chamado `taskflow_db` (usuário: `postgres`, senha: `postgres`).

#### Executando o Backend:
1. No diretório raiz, execute:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(ou `mvnw.cmd spring-boot:run` se estiver no Windows)*.

#### Compilando o Frontend (TypeScript):
1. Entre na pasta `frontend/`:
   ```bash
   cd frontend
   ```
2. Instale o compilador TypeScript:
   ```bash
   npm install
   ```
3. Compile o código:
   ```bash
   npm run build
   ```
4. Os arquivos JavaScript compilados estarão na pasta `frontend/dist/`.

---

## 📈 Histórico de Commits

Este projeto foi construído commit por commit para demonstrar uma evolução clara. Você pode estudar o histórico de alterações no terminal com:
```bash
git log --oneline
```
Cada commit foca em um único arquivo, classe ou funcionalidade lógica!

---

## 🔮 Próximos Passos de Evolução (Estudo Avançado)
Para continuar evoluindo de Júnior para Pleno, sugerimos implementar neste mesmo repositório:
1. **Segurança**: Adicionar Spring Security com autenticação Stateless via tokens JWT.
2. **Testes Unitários**: Criar testes com JUnit 5 e Mockito na camada `TaskService`.
3. **Paginação**: Adicionar suporte a paginação (`Pageable`) e ordenação na listagem de tarefas.
