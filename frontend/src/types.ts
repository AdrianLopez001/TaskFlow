/**
 * DEFINIÇÃO DE TIPOS & INTERFACES (types.ts)
 * 
 * Por que definir tipos em TypeScript?
 * Interfaces garantem que o compilador do TypeScript valide as propriedades e
 * tipos de dados de objetos em tempo de compilação. Isso elimina a ocorrência 
 * comum de erros "undefined is not a function" ou tentativas de ler propriedades 
 * inexistentes de objetos JSON recebidos da API em tempo de execução.
 */

// Tipo que restringe o status da tarefa apenas aos valores aceitos pelo backend
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

// Tipo que restringe a prioridade da tarefa aos valores válidos
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// Interface representando o contrato de resposta de uma Tarefa (TaskResponseDTO)
export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt?: string; // Data no formato ISO String vinda da API
}

// Interface representando o contrato de envio de uma Tarefa (TaskRequestDTO)
export interface TaskRequest {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
}

// Estrutura de erros de validação retornada pela API REST
export interface ValidationErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
    fieldErrors: Record<string, string>;
}
