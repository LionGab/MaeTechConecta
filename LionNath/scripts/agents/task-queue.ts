/**
 * Task Queue - Fila de tarefas compartilhada
 *
 * Gerencia fila de tarefas com priorização e distribuição para agentes
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Task {
  id: string;
  type: string;
  filePath: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  agent?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface TaskQueueData {
  tasks: Task[];
  lastTaskId: number;
}

export class TaskQueue {
  private queueFile: string;

  constructor(queueFile: string = '.agents/.queue.json') {
    this.queueFile = queueFile;
  }

  /**
   * Garante que o diretório da fila existe
   */
  private async ensureQueueDir(): Promise<void> {
    const dir = path.dirname(this.queueFile);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Diretório já existe
    }
  }

  /**
   * Carrega fila do arquivo
   */
  private async loadQueue(): Promise<TaskQueueData> {
    try {
      await this.ensureQueueDir();
      const content = await fs.readFile(this.queueFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return {
        tasks: [],
        lastTaskId: 0,
      };
    }
  }

  /**
   * Salva fila no arquivo
   */
  private async saveQueue(data: TaskQueueData): Promise<void> {
    await this.ensureQueueDir();
    await fs.writeFile(this.queueFile, JSON.stringify(data, null, 2), 'utf8');
  }

  /**
   * Gera ID único para tarefa
   */
  private generateTaskId(lastId: number): string {
    return `task-${Date.now()}-${lastId + 1}`;
  }

  /**
   * Adiciona tarefa à fila
   */
  async addTask(
    type: string,
    filePath: string,
    description: string,
    priority: TaskPriority = TaskPriority.MEDIUM
  ): Promise<Task> {
    const queue = await this.loadQueue();

    // Verifica se tarefa já existe (evita duplicatas)
    const existingTask = queue.tasks.find(
      (t) => t.type === type && t.filePath === filePath && t.status === TaskStatus.PENDING
    );

    if (existingTask) {
      return existingTask;
    }

    const task: Task = {
      id: this.generateTaskId(queue.lastTaskId),
      type,
      filePath,
      description,
      priority,
      status: TaskStatus.PENDING,
      createdAt: Date.now(),
    };

    queue.tasks.push(task);
    queue.lastTaskId += 1;

    await this.saveQueue(queue);
    return task;
  }

  /**
   * Obtém próxima tarefa para um agente
   */
  async getNextTask(agent: string, taskType?: string): Promise<Task | null> {
    const queue = await this.loadQueue();

    // Filtra tarefas pendentes
    let pendingTasks = queue.tasks.filter((t) => t.status === TaskStatus.PENDING);

    // Filtra por tipo se especificado
    if (taskType) {
      pendingTasks = pendingTasks.filter((t) => t.type === taskType);
    }

    // Ordena por prioridade (maior primeiro) e depois por data de criação
    pendingTasks.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.createdAt - b.createdAt;
    });

    if (pendingTasks.length === 0) {
      return null;
    }

    const task = pendingTasks[0];
    task.status = TaskStatus.IN_PROGRESS;
    task.agent = agent;
    task.startedAt = Date.now();

    await this.saveQueue(queue);
    return task;
  }

  /**
   * Marca tarefa como concluída
   */
  async completeTask(taskId: string): Promise<void> {
    const queue = await this.loadQueue();
    const task = queue.tasks.find((t) => t.id === taskId);

    if (task) {
      task.status = TaskStatus.COMPLETED;
      task.completedAt = Date.now();
      await this.saveQueue(queue);
    }
  }

  /**
   * Marca tarefa como falha
   */
  async failTask(taskId: string, error: string): Promise<void> {
    const queue = await this.loadQueue();
    const task = queue.tasks.find((t) => t.id === taskId);

    if (task) {
      task.status = TaskStatus.FAILED;
      task.error = error;
      task.completedAt = Date.now();
      await this.saveQueue(queue);
    }
  }

  /**
   * Obtém estatísticas da fila
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
  }> {
    const queue = await this.loadQueue();

    return {
      total: queue.tasks.length,
      pending: queue.tasks.filter((t) => t.status === TaskStatus.PENDING).length,
      inProgress: queue.tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      completed: queue.tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
      failed: queue.tasks.filter((t) => t.status === TaskStatus.FAILED).length,
    };
  }

  /**
   * Limpa tarefas antigas (completadas há mais de 7 dias)
   */
  async cleanOldTasks(): Promise<number> {
    const queue = await this.loadQueue();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const initialLength = queue.tasks.length;
    queue.tasks = queue.tasks.filter((task) => {
      if (task.status === TaskStatus.COMPLETED && task.completedAt) {
        return task.completedAt > sevenDaysAgo;
      }
      if (task.status === TaskStatus.FAILED && task.completedAt) {
        return task.completedAt > sevenDaysAgo;
      }
      return true; // Mantém pendentes e em progresso
    });

    const removed = initialLength - queue.tasks.length;
    if (removed > 0) {
      await this.saveQueue(queue);
    }

    return removed;
  }

  /**
   * Obtém todas as tarefas
   */
  async getAllTasks(): Promise<Task[]> {
    const queue = await this.loadQueue();
    return queue.tasks;
  }
}

// Instância singleton
export const taskQueue = new TaskQueue();
