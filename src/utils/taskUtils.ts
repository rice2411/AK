import { format, parseISO } from "date-fns";
import type { Task } from "../types/Task";
import {
  getNextWeek,
  getWeekEnd,
  getWeekStart,
  isDateInWeek,
} from "./dateUtils";
import type { WeekData } from "../types/WeekData";
import { vi } from "date-fns/locale";

export const getCurrentWeekTasks = (
  tasks: Task[],
  weekStart: Date,
  weekEnd: Date,
  selectedWeek: Date,
  currentDate: Date = new Date()
): Task[] => {
  const currentWeekStart = getWeekStart(currentDate);
  const selectedWeekStart = getWeekStart(selectedWeek);

  return tasks.filter((task) => {
    // Logic mới:
    // - Task DONE: chỉ tính theo ngày modified_date
    // - Task MR, inprogress, incoming: chỉ tính cho tuần hiện tại và tương lai
    // - Tuần trước: chỉ hiển thị task DONE

    if (task.status === "DONE") {
      // Task DONE: chỉ tính theo ngày modify
      if (!task.modified_date) {
        return false;
      }
      const taskDate = parseISO(task.modified_date);
      return isDateInWeek(taskDate, weekStart, weekEnd);
    } else if (
      task.status === "MR" ||
      task.status === "inprogress" ||
      task.status === "incoming"
    ) {
      // Task MR, inprogress, incoming: chỉ tính cho tuần hiện tại và tương lai
      // So sánh tuần được chọn với tuần hiện tại thực sự
      return selectedWeekStart.getTime() >= currentWeekStart.getTime();
    }

    return false;
  });
};

export const groupTasksByWeek = (
  tasks: Task[],
  startDate: Date,
  endDate: Date,
  realCurrentDate: Date = new Date()
): WeekData[] => {
  const weeks: WeekData[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = getWeekEnd(currentDate);

    const weekTasks = getCurrentWeekTasks(
      tasks,
      weekStart,
      weekEnd,
      currentDate,
      realCurrentDate
    );

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
