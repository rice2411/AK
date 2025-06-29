import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";

import Dashboard from "./components/Dashboard";
import WeekNavigation from "./components/WeekNavigation";
import WeekView from "./components/WeekView";
import YearlyStats from "./components/MonthlyChart";
import TeamStats from "./components/TeamStats";
import type { Task } from "./types/Task";
import type { UserInfo } from "./types/User";
import { groupTasksByWeek, getWeekStart, getWeekEnd } from "./utils/dateUtils";
import { TaigaService } from "./services/TaigaService";
import { config, validateConfig } from "./config/env";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Validate environment variables
  useEffect(() => {
    validateConfig();
  }, []);

  // Lấy team members từ config
  const teamMembers = config.team.members;

  // Khởi tạo TaigaService và lấy dữ liệu
  useEffect(() => {
    const initializeService = async () => {
      try {
        setLoading(true);
        setError(null);

        // Khởi tạo service với đăng nhập tự động
        const service = await TaigaService.initialize();

        // Lấy thông tin user từ service
        const user = service.getUserInfo();
        setUserInfo(user);

        // Lấy tasks chỉ của 2 user cố định
        const userIds = teamMembers.map((u) => u.id);

        const allTasks = await service.getAllTasks(userIds);
        setTasks(allTasks);

        console.log(
          `Đã tải ${allTasks.length} tasks từ KonyTaiga cho ${teamMembers
            .map((u) => u.name)
            .join(", ")}`
        );
      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
        setError(
          "Không thể kết nối đến KonyTaiga. Vui lòng kiểm tra lại thông tin đăng nhập."
        );
      } finally {
        setLoading(false);
      }
    };

    initializeService();
  }, [teamMembers]);

  // Callback khi đổi tuần
  const handleWeekChange = (newDate: Date) => {
    setCurrentWeek(newDate);
  };

  // Không cần lọc nữa vì đã lọc từ API
  const filteredTasks = tasks;

  // Tính toán dữ liệu tuần hiện tại
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
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={2}
        sx={{ background: "#f5f6fa", minHeight: "100vh", width: "100vw" }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="black">
          Đang kết nối đến KonyTaiga...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={2}
        sx={{ background: "#f5f6fa", minHeight: "100vh", width: "100vw" }}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Box sx={{ minHeight: "100vh", width: "100vw", background: "#f5f6fa" }}>
        <AppBar position="static" color="primary" elevation={2}>
          <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AK Task Tracking - KonyTaiga
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {userInfo?.photo && (
                <Avatar
                  src={userInfo.photo}
                  alt={userInfo.full_name_display}
                  sx={{ width: 32, height: 32 }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#fff",
                  background: "#1976d2",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                {userInfo?.full_name_display || userInfo?.email || "User"}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, p: 0 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 4,
              background: "#fff",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            Team: {teamMembers.map((u) => u.name).join(" & ")}
          </Paper>

          <Dashboard tasks={filteredTasks} />

          <WeekNavigation
            currentDate={currentWeek}
            onDateChange={handleWeekChange}
          />

          <WeekView weekData={weekData} />

          {/* Phần thống kê theo năm - độc lập với tracking theo tuần */}
          <YearlyStats tasks={filteredTasks} />

          <TeamStats tasks={filteredTasks} teamMembers={teamMembers} />
        </Container>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
