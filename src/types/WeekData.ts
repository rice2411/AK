import type { Task } from "./Task";

export interface WeekData {
  weekStart: Date;
  weekEnd: Date;
  tasks: Task[];
  totalEstimatedHours: number;
  totalActualHours: number;
  completedTasks: number;
  totalTasks: number;
  doneTasks: Task[];
  mrTasks: Task[];
  inProgressAndIncomingTasks: Task[];
  doneCount: number;
  mrCount: number;
  inProgressAndIncomingCount: number;
}
