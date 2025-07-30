import { create } from 'zustand';
import type { Task } from '../types/Task';
import { PENTDING_TASK_ID } from '../constant/pending';

interface TaskStoreState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  getNoPendingTasks: (tasks: Task[]) => Task[];
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  getNoPendingTasks: (tasks) => {
    // Cache kết quả để tránh tính toán lại
    const currentTasks = get().tasks;
    if (tasks === currentTasks) {
      return currentTasks.filter((task) => !PENTDING_TASK_ID.includes(task.id));
    }
    return tasks.filter((task) => !PENTDING_TASK_ID.includes(task.id));
  },
})); 