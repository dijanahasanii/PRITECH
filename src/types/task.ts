export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdDate: string;
}

export type TaskFilter = 'all' | 'pending' | 'completed';
