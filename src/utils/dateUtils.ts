import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { vi } from "date-fns/locale";
import type { Task } from "../types/Task";
import type { WeekData } from "../types/WeekData";

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy", { locale: vi });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy HH:mm", { locale: vi });
};

export const getWeekStart = (date: Date = new Date()): Date => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Thứ 2 là đầu tuần
};

export const getWeekEnd = (date: Date = new Date()): Date => {
  return endOfWeek(date, { weekStartsOn: 1 }); // Chủ nhật là cuối tuần
};

export const getNextWeek = (date: Date): Date => {
  return addWeeks(date, 1);
};

export const getPreviousWeek = (date: Date): Date => {
  return subWeeks(date, 1);
};

export const isDateInWeek = (
  date: Date | string,
  weekStart: Date,
  weekEnd: Date
): boolean => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isWithinInterval(dateObj, { start: weekStart, end: weekEnd });
};

export const groupTasksByWeek = (
  tasks: Task[],
  startDate: Date,
  endDate: Date
): WeekData[] => {
  const weeks: WeekData[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = getWeekEnd(currentDate);

    const weekTasks = tasks.filter((task) => {
      // Chỉ sử dụng modified_date, không dùng created_date
      if (!task.modified_date) {
        return false; // Bỏ qua task không có modified_date
      }
      const taskDate = parseISO(task.modified_date);
      return isDateInWeek(taskDate, weekStart, weekEnd);
    });

    // Phân loại tasks theo trạng thái
    const doneTasks = weekTasks.filter((task) => task.status === "DONE");
    const mrTasks = weekTasks.filter((task) => task.status === "MR");
    const inProgressAndIncomingTasks = weekTasks.filter(
      (task) => task.status === "inprogress" || task.status === "incoming"
    );

    const totalEstimatedHours = weekTasks.reduce(
      (sum, task) => sum + (task.estimated_hours || 0),
      0
    );
    const totalActualHours = weekTasks.reduce(
      (sum, task) => sum + (task.actual_hours || 0),
      0
    );
    const completedTasks = doneTasks.length;

    weeks.push({
      weekStart,
      weekEnd,
      tasks: weekTasks,
      totalEstimatedHours,
      totalActualHours,
      completedTasks,
      totalTasks: weekTasks.length,
      // Phân loại theo trạng thái
      doneTasks,
      mrTasks,
      inProgressAndIncomingTasks,
      // Thống kê theo trạng thái
      doneCount: doneTasks.length,
      mrCount: mrTasks.length,
      inProgressAndIncomingCount: inProgressAndIncomingTasks.length,
    });

    currentDate = getNextWeek(currentDate);
  }

  return weeks;
};

export const getWeekLabel = (weekStart: Date, weekEnd: Date): string => {
  const startStr = format(weekStart, "dd/MM", { locale: vi });
  const endStr = format(weekEnd, "dd/MM/yyyy", { locale: vi });
  return `Tuần ${startStr} - ${endStr}`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "DONE":
      return "#4caf50"; // Green
    case "MR":
      return "#9c27b0"; // Purple
    case "inprogress":
      return "#ff9800"; // Orange
    case "incoming":
      return "#2196f3"; // Blue
    default:
      return "#757575"; // Grey
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Low":
      return "#4caf50"; // Green
    case "Normal":
      return "#2196f3"; // Blue
    case "High":
      return "#ff9800"; // Orange
    case "Critical":
      return "#f44336"; // Red
    default:
      return "#757575"; // Grey
  }
};
