import { Task } from '../../types';

export interface TasksDAO {
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  getTasksByUser(userId: string): Promise<Task[]>;
  getTasksByStatus(status: Task['status']): Promise<Task[]>;

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Task | null>;

  archiveTask(id: string): Promise<Task | null>; // Soft delete
  deleteTask(id: string): Promise<boolean>;
}
