import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import type { WeekData } from "../../../types/WeekData";
import { getWeekLabel } from "../../../utils/taskUtils";
import { pendingtask } from "../../../constant/pending";

interface WeeklyStatsProps {
  weekData: WeekData;
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({ weekData }) => {
  const completionRate =
    weekData.totalTasks > 0
      ? (weekData.completedTasks / weekData.totalTasks) * 100
      : 0;

  const inProgressAndIncomingCount = weekData.inProgressAndIncomingCount - pendingtask.length;

  return (
    <Card sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Thống kê tuần: {getWeekLabel(weekData.weekStart, weekData.weekEnd)}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <Box textAlign="center">
            <Typography
              variant="h4"
              color="success.main"
              sx={{ fontWeight: 600 }}
            >
              {weekData.doneCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DONE
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography
              variant="h4"
              color="secondary.main"
              sx={{ fontWeight: 600 }}
            >
              {weekData.mrCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              MR
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography
              variant="h4"
              color="warning.main"
              sx={{ fontWeight: 600 }}
            >
              {inProgressAndIncomingCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress & Incoming
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography
              variant="h4"
              color="error.main"
              sx={{ fontWeight: 600 }}
            >
              {pendingtask.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Box>
        </Box>

        <Box mb={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" color="text.secondary">
              Tỷ lệ hoàn thành
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completionRate.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionRate}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 2,
          }}
        >
          <Box
            textAlign="center"
            p={2}
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {weekData.totalTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng tasks
            </Typography>
          </Box>
          <Box
            textAlign="center"
            p={2}
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              13
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mục tiêu DONE
            </Typography>
          </Box>
          <Box
            textAlign="center"
            p={2}
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {weekData.doneCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã DONE
            </Typography>
          </Box>
          <Box
            textAlign="center"
            p={2}
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {pendingtask.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyStats;
