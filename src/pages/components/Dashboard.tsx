import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import type { Task } from "../../types/Task";

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.status === "DONE").length;
  const mrTasks = tasks.filter((task) => task.status === "MR").length;
  const inProgressAndIncomingTasks = tasks.filter(
    (task) => task.status === "inprogress" || task.status === "incoming"
  ).length;

  const totalEstimatedHours = tasks.reduce(
    (sum, task) => sum + (task.estimated_hours || 0),
    0
  );
  const totalActualHours = tasks.reduce(
    (sum, task) => sum + (task.actual_hours || 0),
    0
  );
  const completionRate = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  const getStatusDistribution = () => {
    const statusCounts: { [key: string]: number } = {};
    tasks.forEach((task) => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    });
    return statusCounts;
  };

  const statusDistribution = getStatusDistribution();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 3, fontWeight: 600, color: "black" }}
      >
        Dashboard - Tracking Task
      </Typography>

      {/* Thống kê tổng quan */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card sx={{ height: "100%", backgroundColor: "#e3f2fd" }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  {totalTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng số task
                </Typography>
              </Box>
              <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%", backgroundColor: "#e8f5e8" }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h4"
                  color="success.main"
                  sx={{ fontWeight: 600 }}
                >
                  {doneTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  DONE
                </Typography>
              </Box>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%", backgroundColor: "#f3e5f5" }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h4"
                  color="secondary.main"
                  sx={{ fontWeight: 600 }}
                >
                  {mrTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  MR
                </Typography>
              </Box>
              <CheckCircleIcon color="secondary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%", backgroundColor: "#fff3e0" }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h4"
                  color="warning.main"
                  sx={{ fontWeight: 600 }}
                >
                  {inProgressAndIncomingTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress & Incoming
                </Typography>
              </Box>
              <ScheduleIcon color="warning" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Thống kê chi tiết */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tỷ lệ hoàn thành
            </Typography>
            <Box mb={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="body2" color="text.secondary">
                  Tiến độ chung
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completionRate.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
                Giờ ước tính: {totalEstimatedHours}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giờ thực tế: {totalActualHours}h
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Phân bố trạng thái
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Object.entries(statusDistribution).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  variant="outlined"
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
