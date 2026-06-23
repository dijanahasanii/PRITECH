import AsyncStorage from '@react-native-async-storage/async-storage';

import { TASKS_STORAGE_KEY } from '../constants/storage';
import type { Task } from '../types/task';

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (!data) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage can fail on some Expo Go builds; in-memory state still updates.
  }
};
