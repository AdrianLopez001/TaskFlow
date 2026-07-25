/**
 * FASE 1: VANILLA JAVASCRIPT & FETCH API (app.js)
 * 
 * O que o aluno aprende neste arquivo?
 * 1. Manipulação direta do DOM (Document Object Model) usando seletores nativos.
 * 2. Chamadas assíncronas HTTP usando a Fetch API com a sintaxe moderna async/await.
 * 3. Gerenciamento básico de estado local e renderização dinâmica em resposta a ações do usuário.
 */

const API_URL = 'http://localhost:8080/api/tasks';

// Elementos do DOM
const listPending = document.getElementById('list-pending');
const listProgress = document.getElementById('list-progress');
const listCompleted = document.getElementById('list-completed');

const countPending = document.getElementById('count-pending');
const countProgress = document.getElementById('count-progress');
const countCompleted = document.getElementById('count-completed');

const statTotalVal = document.querySelector('#stat-total .stat-val');
const statPendingVal = document.querySelector('#stat-pending .stat-val');
const statCompletedVal = document.querySelector('#stat-completed .stat-val');

const taskModal = document.getElementById('task-modal');
const btnNewTask = document.getElementById('btn-new-task');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const taskForm = document.getElementById('task-form');

const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title-input');
const descInput = document.getElementById('desc-input');
const statusSelect = document.getElementById('status-select');
const prioritySelect = document.getElementById('priority-select');
const modalTitle = document.getElementById('modal-title');

// Carregar tarefas iniciais ao inicializar a página
document.addEventListener('DOMContentLoaded', fetchTasks);

// Event Listeners para controle de Modais
btnNewTask.addEventListener('click', () => openModal());
btnCloseModal.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', closeModal);
taskForm.addEventListener('submit', handleFormSubmit);

/**
 * Busca todas as tarefas da API REST
 */
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const tasks = await response.json();
        renderBoard(tasks);
    } catch (error) {
        console.error('Falha ao buscar tarefas:', error);
        alert('Erro ao conectar com a API do Spring Boot. Verifique se o servidor está rodando na porta 8080.');
    }
}

/**
 * Renderiza o quadro Kanban e atualiza as estatísticas globais
 */
function renderBoard(tasks) {
    // Limpar listas existentes
    listPending.innerHTML = '';
    listProgress.innerHTML = '';
    listCompleted.innerHTML = '';

    // Contadores locais
    let pendingCount = 0;
    let progressCount = 0;
    let completedCount = 0;

    tasks.forEach(task => {
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

    // Tratar estados vazios visualmente
    checkEmptyColumn(listPending, 'Nenhuma tarefa pendente');
    checkEmptyColumn(listProgress, 'Nenhuma tarefa em progresso');
    checkEmptyColumn(listCompleted, 'Nenhuma tarefa concluída');

    // Atualizar números no cabeçalho das colunas
    countPending.textContent = pendingCount;
    countProgress.textContent = progressCount;
    countCompleted.textContent = completedCount;

    // Atualizar estatísticas do topo
    statTotalVal.textContent = tasks.length;
    statPendingVal.textContent = pendingCount + progressCount;
    statCompletedVal.textContent = completedCount;
}

/**
 * Cria o elemento HTML do cartão de tarefa (DOM)
 */
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-id', task.id);

    // Formatar a data de criação
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

/**
 * Auxiliar para injetar texto de forma segura prevenindo ataques de XSS (Cross-Site Scripting)
 */
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

/**
 * Verifica se a coluna está vazia e exibe uma mensagem amigável
 */
function checkEmptyColumn(container, message) {
    if (container.children.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = `<p>${message}</p>`;
        container.appendChild(empty);
    }
}

/* ==========================================================================
   AÇÕES DO FORMULÁRIO (Criar / Editar)
   ========================================================================== */
function openModal(task = null) {
    taskModal.classList.add('active');
    
    if (task) {
        modalTitle.textContent = 'Editar Tarefa';
        taskIdInput.value = task.id;
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

function closeModal() {
    taskModal.classList.remove('active');
    taskForm.reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const id = taskIdInput.value;
    const taskData = {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        status: statusSelect.value,
        priority: prioritySelect.value
    };

    try {
        let response;
        if (id) {
            // Se possui ID, é uma atualização (PUT)
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        } else {
            // Se não possui ID, é uma criação (POST)
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            // Lógica para interceptar erros de validação da API
            if (errorData.fieldErrors) {
                const msgs = Object.values(errorData.fieldErrors).join('\n');
                throw new Error(msgs);
            }
            throw new Error(errorData.message || 'Erro ao salvar tarefa');
        }

        closeModal();
        fetchTasks();
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro de validação:\n${error.message}`);
    }
}

/* ==========================================================================
   AÇÕES DIRETAS NOS CARTÕES (Excluir, Avançar, Editar)
   ========================================================================== */
window.deleteTask = async function(id) {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Erro HTTP ao deletar: ${response.status}`);
        }
        fetchTasks();
    } catch (error) {
        console.error('Falha ao deletar:', error);
        alert('Erro ao excluir tarefa do banco.');
    }
}

window.editTask = async function(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Erro ao carregar detalhes: ${response.status}`);
        const task = await response.json();
        openModal(task);
    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
    }
}

window.advanceStatus = async function(id, currentStatus) {
    let nextStatus;
    if (currentStatus === 'PENDING') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    else return; // Já concluído

    try {
        // Primeiro, busca a tarefa atualizada
        const getResponse = await fetch(`${API_URL}/${id}`);
        if (!getResponse.ok) throw new Error();
        const task = await getResponse.json();

        // Envia a tarefa com o novo status
        const updateResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                status: nextStatus,
                priority: task.priority
            })
        });

        if (!updateResponse.ok) throw new Error();
        fetchTasks();
    } catch (error) {
        console.error('Falha ao avançar status:', error);
        alert('Erro ao atualizar status no servidor.');
    }
}
