import { create } from 'zustand';
import type { Task } from '../types/Task';

interface TaskStoreState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStoreState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
})); 