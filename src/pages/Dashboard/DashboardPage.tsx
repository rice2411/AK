import React, { useState, useMemo } from "react";
import { Container } from "@mui/material";
import Dashboard from "./components/Dashboard";
import WeekNavigation from "./components/WeekNavigation";
import WeekView from "./components/WeekView";
import YearlyStats from "./components/MonthlyChart";
import { getWeekStart, getWeekEnd } from "../../utils/dateUtils";
import { useTaskStore } from "../../store/taskStore";
import { getCurrentWeekTasks } from "../../utils/taskUtils";

const DashboardPage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const tasks = useTaskStore((state) => state.tasks);

  const handleWeekChange = (newDate: Date) => {
    setCurrentWeek(newDate);
  };

  // Cache các tính toán để tránh tính toán lại
  const weekData = useMemo(() => {
    const filteredTasks = tasks;
    const weekStart = getWeekStart(currentWeek);
    const weekEnd = getWeekEnd(currentWeek);

    // Sử dụng logic mới: task DONE theo ngày modify, task khác luôn tính cho tuần hiện tại
    const weekTasks = getCurrentWeekTasks(
      filteredTasks,
      weekStart,
      weekEnd,
      currentWeek,
      new Date()
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

    return {
      weekStart,
      weekEnd,
      tasks: weekTasks,
      totalEstimatedHours,
      totalActualHours,
      completedTasks,
      totalTasks: weekTasks.length,
      doneTasks,
      mrTasks,
      inProgressAndIncomingTasks,
      doneCount: doneTasks.length,
      mrCount: mrTasks.length,
      inProgressAndIncomingCount: inProgressAndIncomingTasks.length,
    };
  }, [tasks, currentWeek]);

  return (
    <Container maxWidth={false} sx={{ mt: 2, px: 0, width: "100%" }}>
      <Dashboard tasks={tasks} />
      <WeekNavigation
        currentDate={currentWeek}
        onDateChange={handleWeekChange}
      />
      <WeekView weekData={weekData} />
      <YearlyStats tasks={tasks} />
    </Container>
  );
};

export default DashboardPage;
