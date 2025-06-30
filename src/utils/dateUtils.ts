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
