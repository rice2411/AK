import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import type { Task } from "../../types/Task";
import type { UserInfo } from "../../types/User";

interface TeamStatsProps {
  tasks: Task[];
  teamMembers: UserInfo[];
}

const TeamStats: React.FC<TeamStatsProps> = ({ tasks, teamMembers }) => {
  // Tính toán số lượng tasks theo từng member và trạng thái
  const getMemberStats = (memberId: number) => {
    const memberTasks = tasks.filter((task) => {
      // Kiểm tra nếu task có assigned_to
      if (!task.assigned_to) return false;

      // Chuyển đổi assigned_to thành string để so sánh
      const assignedToStr = String(task.assigned_to);

      // Kiểm tra theo ID
      if (assignedToStr.includes(memberId.toString())) return true;

      // Kiểm tra theo tên (fallback)
      const member = teamMembers.find((m) => m.id === memberId);
      if (member && assignedToStr.includes(member.full_name_display || member.username)) return true;

      return false;
    });

    return {
      total: memberTasks.length,
      done: memberTasks.filter((task) => task.status === "DONE").length,
      mr: memberTasks.filter((task) => task.status === "MR").length,
      inProgressAndIncoming: memberTasks.filter(
        (task) => task.status === "inprogress" || task.status === "incoming"
      ).length,
    };
  };

  // Màu sắc cho từng trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "#4caf50"; // Green
      case "mr":
        return "#9c27b0"; // Purple
      case "inProgressAndIncoming":
        return "#ff9800"; // Orange
      default:
        return "#757575"; // Grey
    }
  };

  return (
    <Card sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Thống kê Team
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {teamMembers.map((member) => {
            const stats = getMemberStats(member.id);

            return (
              <Card
                key={member.id}
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fafafa",
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={member.photo}
                    alt={member.full_name_display || member.username}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  >
                    {(member.full_name_display || member.username).charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {member.full_name_display || member.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.total} tasks
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">DONE:</Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: getStatusColor("done") }}
                    >
                      {stats.done}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">MR:</Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: getStatusColor("mr") }}
                    >
                      {stats.mr}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">
                      In Progress & Incoming:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: getStatusColor("inProgressAndIncoming"),
                      }}
                    >
                      {stats.inProgressAndIncoming}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TeamStats;
