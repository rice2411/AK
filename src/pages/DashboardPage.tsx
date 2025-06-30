import React, { useState } from "react";
import {
  Container,
  Paper,
} from "@mui/material";
import Dashboard from "./components/Dashboard";
import WeekNavigation from "./components/WeekNavigation";
import WeekView from "./components/WeekView";
import YearlyStats from "./components/MonthlyChart";
import TeamStats from "./components/TeamStats";
import { groupTasksByWeek, getWeekStart, getWeekEnd } from "../utils/dateUtils";
import { useTaskStore } from "../store/taskStore";
import { useTeamStore } from "../store/teamStore";



const DashboardPage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const tasks = useTaskStore((state) => state.tasks);
  const teamMembers = useTeamStore((state) => state.teamMembers);

  const handleWeekChange = (newDate: Date) => {
    setCurrentWeek(newDate);
  };

  const filteredTasks = tasks;
  const weekStart = getWeekStart(currentWeek);
  const weekEnd = getWeekEnd(currentWeek);
  const weekData = groupTasksByWeek(filteredTasks, weekStart, weekEnd)[0] || {
    weekStart,
    weekEnd,
    tasks: [],
    totalEstimatedHours: 0,
    totalActualHours: 0,
    completedTasks: 0,
    totalTasks: 0,
    doneTasks: [],
    mrTasks: [],
    inProgressAndIncomingTasks: [],
    doneCount: 0,
    mrCount: 0,
    inProgressAndIncomingCount: 0,
  };

  return (
      <Container maxWidth={false}  sx={{ m: 2, px: 0 , width: "100%"}}>

        <Dashboard tasks={filteredTasks} />
        <WeekNavigation currentDate={currentWeek} onDateChange={handleWeekChange} />
        <WeekView weekData={weekData} />
        <YearlyStats tasks={filteredTasks} />
        <TeamStats tasks={filteredTasks} teamMembers={teamMembers} />
      </Container>
  );
};

export default DashboardPage;
