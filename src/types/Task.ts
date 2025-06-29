export interface Task {
  id: number;
  subject: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_date: string;
  modified_date?: string;
  finished_date?: string;
  due_date?: string;
  assigned_to?: string;
  project: string;
  tags: string[];
  estimated_hours?: number;
  actual_hours?: number;
}

export const TaskStatus = {
  DONE: "DONE",
  MR: "MR",
  IN_PROGRESS: "inprogress",
  INCOMING: "incoming",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  CRITICAL: "Critical",
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];
