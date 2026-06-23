import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loadTasks, saveTasks } from '../storage/taskStorage';
import type { Task, TaskStatus } from '../types/task';

interface TaskContextValue {
  tasks: Task[];
  isLoading: boolean;
  addTask: (title: string, description: string) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextValue | null>(null);

const createTask = (title: string, description: string): Task => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  title: title.trim(),
  description: description.trim(),
  status: 'pending',
  createdDate: new Date().toISOString(),
});

const sortTasksNewestFirst = (taskList: Task[]): Task[] =>
  [...taskList].sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
  );

const mergeTasks = (current: Task[], stored: Task[]): Task[] => {
  const merged = new Map<string, Task>();

  for (const task of stored) {
    merged.set(task.id, task);
  }

  for (const task of current) {
    merged.set(task.id, task);
  }

  return sortTasksNewestFirst([...merged.values()]);
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const stored = await loadTasks();
      if (cancelled) {
        return;
      }

      setTasks((current) => mergeTasks(current, stored));
      setIsLoading(false);
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistTasks = useCallback((nextTasks: Task[]) => {
    void saveTasks(nextTasks);
  }, []);

  const addTask = useCallback(
    (title: string, description: string) => {
      const newTask = createTask(title, description);
      setTasks((prev) => {
        const nextTasks = [newTask, ...prev];
        persistTasks(nextTasks);
        return nextTasks;
      });
    },
    [persistTasks],
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>) => {
      setTasks((prev) => {
        const nextTasks = prev.map((task) =>
          task.id === id ? { ...task, ...updates } : task,
        );
        persistTasks(nextTasks);
        return nextTasks;
      });
    },
    [persistTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const nextTasks = prev.filter((task) => task.id !== id);
        persistTasks(nextTasks);
        return nextTasks;
      });
    },
    [persistTasks],
  );

  const toggleTaskStatus = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const nextTasks = prev.map((task) => {
          if (task.id !== id) {
            return task;
          }
          const nextStatus: TaskStatus = task.status === 'pending' ? 'completed' : 'pending';
          return { ...task, status: nextStatus };
        });
        persistTasks(nextTasks);
        return nextTasks;
      });
    },
    [persistTasks],
  );

  const getTaskById = useCallback(
    (id: string) => tasks.find((task) => task.id === id),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      getTaskById,
    }),
    [tasks, isLoading, addTask, updateTask, deleteTask, toggleTaskStatus, getTaskById],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
