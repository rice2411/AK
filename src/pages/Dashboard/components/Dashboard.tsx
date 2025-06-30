import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import type { Task } from "../../../types/Task";

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const targetTasks = 180; // Số task mục tiêu phải DONE, có thể thay đổi hoặc truyền từ props

  const getStatusDistribution = () => {
    const statusCounts: { [key: string]: number } = {};
    tasks.forEach((task) => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    });
    return statusCounts;
  };

  const statusDistribution = getStatusDistribution();

  return (
    <Box sx={{ mb: 4, px: { xs: 2, sm: 3, md: 0 } }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h1"
        sx={{
          mb: { xs: 2, md: 3 },
          fontWeight: 600,
          color: "black",
          textAlign: { xs: "center", md: "left" },
        }}
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
          gap: { xs: 2, md: 3 },
          mb: { xs: 3, md: 4 },
        }}
      >
        <Card
          sx={{
            height: "100%",
            backgroundColor: "#e3f2fd",
            minHeight: { xs: "120px", md: "auto" },
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDirection={isMobile ? "column" : "row"}
              textAlign={isMobile ? "center" : "left"}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  color="primary"
                  sx={{ fontWeight: 600, mb: isMobile ? 1 : 0 }}
                >
                  {totalTasks}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  Tổng số task
                </Typography>
              </Box>
              <TrendingUpIcon
                color="primary"
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  mt: isMobile ? 1 : 0,
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            height: "100%",
            backgroundColor: "#e8f5e8",
            minHeight: { xs: "120px", md: "auto" },
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDirection={isMobile ? "column" : "row"}
              textAlign={isMobile ? "center" : "left"}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  color="success.main"
                  sx={{ fontWeight: 600, mb: isMobile ? 1 : 0 }}
                >
                  {doneTasks}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  DONE
                </Typography>
              </Box>
              <CheckCircleIcon
                color="success"
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  mt: isMobile ? 1 : 0,
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            height: "100%",
            backgroundColor: "#f3e5f5",
            minHeight: { xs: "120px", md: "auto" },
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDirection={isMobile ? "column" : "row"}
              textAlign={isMobile ? "center" : "left"}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  color="secondary.main"
                  sx={{ fontWeight: 600, mb: isMobile ? 1 : 0 }}
                >
                  {mrTasks}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  MR
                </Typography>
              </Box>
              <CheckCircleIcon
                color="secondary"
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  mt: isMobile ? 1 : 0,
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            height: "100%",
            backgroundColor: "#fff3e0",
            minHeight: { xs: "120px", md: "auto" },
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDirection={isMobile ? "column" : "row"}
              textAlign={isMobile ? "center" : "left"}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  color="warning.main"
                  sx={{ fontWeight: 600, mb: isMobile ? 1 : 0 }}
                >
                  {inProgressAndIncomingTasks}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                    lineHeight: { xs: 1.2, md: 1.5 },
                  }}
                >
                  In Progress & Incoming
                </Typography>
              </Box>
              <ScheduleIcon
                color="warning"
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  mt: isMobile ? 1 : 0,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Thống kê chi tiết */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              variant={isMobile ? "h6" : "h6"}
              sx={{ mb: { xs: 1.5, md: 2 }, fontWeight: 600 }}
            >
              Tỷ lệ hoàn thành
            </Typography>
            <Box mb={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
                flexDirection={isMobile ? "column" : "row"}
                gap={isMobile ? 0.5 : 0}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  Tiến độ chung
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  {completionRate.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{
                  height: { xs: 8, md: 10 },
                  borderRadius: { xs: 4, md: 5 },
                }}
              />
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection={isMobile ? "column" : "row"}
              gap={isMobile ? 0.5 : 0}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
                Giờ ước tính: {totalEstimatedHours}h
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
                Giờ thực tế: {totalActualHours}h
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              variant={isMobile ? "h6" : "h6"}
              sx={{ mb: { xs: 1.5, md: 2 }, fontWeight: 600 }}
            >
              Phân bố trạng thái
            </Typography>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              justifyContent={isMobile ? "center" : "flex-start"}
            >
              {Object.entries(statusDistribution).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  variant="outlined"
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    height: { xs: 24, md: 32 },
                  }}
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
