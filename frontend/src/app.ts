import { Task, TaskStatus, TaskPriority, TaskRequest, ValidationErrorResponse } from './types.js';

/**
 * FASE 2: MIGRACÃO E EVOLUÇÃO PARA TYPESCRIPT (app.ts)
 * 
 * O que o aluno aprende neste arquivo?
 * 1. Tipagem estática rigorosa de parâmetros, retornos de funções e elementos do DOM.
 * 2. Uso de módulos ES6 nativos no navegador (import/export).
 * 3. Casting de tipos do DOM (ex: HTMLInputElement) para acessar propriedades específicas.
 * 4. Tratamento de exceções e mapeamento seguro de respostas de erro da API.
 */

const API_URL = 'http://localhost:8080/api/tasks';

// Seletores do DOM com asserção de tipos para garantir acesso seguro às propriedades
const listPending = document.getElementById('list-pending') as HTMLDivElement;
const listProgress = document.getElementById('list-progress') as HTMLDivElement;
const listCompleted = document.getElementById('list-completed') as HTMLDivElement;

const countPending = document.getElementById('count-pending') as HTMLSpanElement;
const countProgress = document.getElementById('count-progress') as HTMLSpanElement;
const countCompleted = document.getElementById('count-completed') as HTMLSpanElement;

const statTotalVal = document.querySelector('#stat-total .stat-val') as HTMLSpanElement;
const statPendingVal = document.querySelector('#stat-pending .stat-val') as HTMLSpanElement;
const statCompletedVal = document.querySelector('#stat-completed .stat-val') as HTMLSpanElement;

const taskModal = document.getElementById('task-modal') as HTMLDivElement;
const btnNewTask = document.getElementById('btn-new-task') as HTMLButtonElement;
const btnCloseModal = document.getElementById('btn-close-modal') as HTMLButtonElement;
const btnCancelModal = document.getElementById('btn-cancel-modal') as HTMLButtonElement;
const taskForm = document.getElementById('task-form') as HTMLFormElement;

const taskIdInput = document.getElementById('task-id') as HTMLInputElement;
const titleInput = document.getElementById('title-input') as HTMLInputElement;
const descInput = document.getElementById('desc-input') as HTMLTextAreaElement;
const statusSelect = document.getElementById('status-select') as HTMLSelectElement;
const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
const modalTitle = document.getElementById('modal-title') as HTMLHeadingElement;

// Inicialização
document.addEventListener('DOMContentLoaded', fetchTasks);

btnNewTask.addEventListener('click', () => openModal());
btnCloseModal.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', closeModal);
taskForm.addEventListener('submit', handleFormSubmit);

/**
 * Busca todas as tarefas da API
 */
async function fetchTasks(): Promise<void> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const tasks: Task[] = await response.json();
        renderBoard(tasks);
    } catch (error) {
        console.error('Falha ao buscar tarefas:', error);
        alert('Erro ao conectar com a API do Spring Boot. Verifique se o servidor está rodando na porta 8080.');
    }
}

/**
 * Renderiza as colunas e calcula as estatísticas globais
 */
function renderBoard(tasks: Task[]): void {
    listPending.innerHTML = '';
    listProgress.innerHTML = '';
    listCompleted.innerHTML = '';

    let pendingCount = 0;
    let progressCount = 0;
    let completedCount = 0;

    tasks.forEach((task: Task) => {
        const card = createTaskCard(task);
        
        switch (task.status) {
            case 'PENDING':
                listPending.appendChild(card);
                pendingCount++;
                break;
            case 'IN_PROGRESS':
                listProgress.appendChild(card);
                progressCount++;
                break;
            case 'COMPLETED':
                listCompleted.appendChild(card);
                completedCount++;
                break;
        }
    });

    checkEmptyColumn(listPending, 'Nenhuma tarefa pendente');
    checkEmptyColumn(listProgress, 'Nenhuma tarefa em progresso');
    checkEmptyColumn(listCompleted, 'Nenhuma tarefa concluída');

    countPending.textContent = String(pendingCount);
    countProgress.textContent = String(progressCount);
    countCompleted.textContent = String(completedCount);

    statTotalVal.textContent = String(tasks.length);
    statPendingVal.textContent = String(pendingCount + progressCount);
    statCompletedVal.textContent = String(completedCount);
}

/**
 * Cria o cartão de tarefa estruturado com HTML
 */
function createTaskCard(task: Task): HTMLDivElement {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-id', String(task.id));

    const dateFormatted = task.createdAt 
        ? new Date(task.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : 'Recém criada';

    const priorityClass = `badge-${task.priority.toLowerCase()}`;
    const priorityLabel = task.priority === 'LOW' ? 'Baixa' : task.priority === 'MEDIUM' ? 'Média' : 'Alta';

    card.innerHTML = `
        <div class="task-header">
            <span class="badge ${priorityClass}">${priorityLabel}</span>
            <span class="task-title">${escapeHTML(task.title)}</span>
        </div>
        <p class="task-desc">${task.description ? escapeHTML(task.description) : '<i>Sem descrição.</i>'}</p>
        <div class="task-footer">
            <span class="task-date">📅 ${dateFormatted}</span>
            <div class="task-actions">
                <button class="action-btn" title="Editar Tarefa" onclick="editTask(${task.id})">✏️</button>
                <button class="action-btn action-btn-danger" title="Deletar Tarefa" onclick="deleteTask(${task.id})">🗑️</button>
                ${task.status !== 'COMPLETED' ? `<button class="action-btn" title="Avançar Status" onclick="advanceStatus(${task.id}, '${task.status}')">➡️</button>` : ''}
            </div>
        </div>
    `;

    return card;
}

function escapeHTML(str: string): string {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function checkEmptyColumn(container: HTMLDivElement, message: string): void {
    if (container.children.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = `<p>${message}</p>`;
        container.appendChild(empty);
    }
}

/* ==========================================================================
   CONTROLE DE MODAL E SUBMISSÃO COM TIPAGEM SEGURA
   ========================================================================== */
function openModal(task: Task | null = null): void {
    taskModal.classList.add('active');
    
    if (task) {
        modalTitle.textContent = 'Editar Tarefa';
        taskIdInput.value = String(task.id);
        titleInput.value = task.title;
        descInput.value = task.description || '';
        statusSelect.value = task.status;
        prioritySelect.value = task.priority;
    } else {
        modalTitle.textContent = 'Nova Tarefa';
        taskForm.reset();
        taskIdInput.value = '';
    }
}

function closeModal(): void {
    taskModal.classList.remove('active');
    taskForm.reset();
}

async function handleFormSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const id = taskIdInput.value;
    const taskData: TaskRequest = {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        status: statusSelect.value as TaskStatus,
        priority: prioritySelect.value as TaskPriority
    };

    try {
        let response: Response;
        if (id) {
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        }

        if (!response.ok) {
            const errorData: ValidationErrorResponse = await response.json();
            if (errorData.fieldErrors) {
                const msgs = Object.values(errorData.fieldErrors).join('\n');
                throw new Error(msgs);
            }
            throw new Error(errorData.message || 'Erro ao salvar tarefa');
        }

        closeModal();
        fetchTasks();
    } catch (error: any) {
        console.error('Erro ao salvar:', error);
        alert(`Erro de validação:\n${error.message}`);
    }
}

/* ==========================================================================
   REGISTRO GLOBAL DE FUNÇÕES (Pontes para onClick em Módulos ES6)
   ========================================================================== */

const deleteTask = async (id: number): Promise<void> => {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Erro ao deletar: ${response.status}`);
        }
        fetchTasks();
    } catch (error) {
        console.error('Falha ao deletar:', error);
        alert('Erro ao excluir tarefa do banco.');
    }
};

const editTask = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error();
        const task: Task = await response.json();
        openModal(task);
    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
    }
};

const advanceStatus = async (id: number, currentStatus: TaskStatus): Promise<void> => {
    let nextStatus: TaskStatus;
    if (currentStatus === 'PENDING') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    else return;

    try {
        const getResponse = await fetch(`${API_URL}/${id}`);
        if (!getResponse.ok) throw new Error();
        const task: Task = await getResponse.json();

        const updateResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                status: nextStatus,
                priority: task.priority
            } as TaskRequest)
        });

        if (!updateResponse.ok) throw new Error();
        fetchTasks();
    } catch (error) {
        console.error('Falha ao avançar status:', error);
        alert('Erro ao atualizar status no servidor.');
    }
};

// Como este arquivo compila como um módulo ES6, os escopos de variáveis não são globais por padrão.
// Para manter compatibilidade direta com as chamadas de evento inline do HTML (onclick), expomos
// explicitamente essas funções no objeto global window.
(window as any).deleteTask = deleteTask;
(window as any).editTask = editTask;
(window as any).advanceStatus = advanceStatus;
