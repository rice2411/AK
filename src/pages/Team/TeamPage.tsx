import React from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { useTeamStore } from "../../store/teamStore";
import { useTaskStore } from "../../store/taskStore";
import { formatDate } from "../../utils/dateUtils";

const TeamPage: React.FC = () => {
  const teamMembers = useTeamStore((state) => state.teamMembers);
  const tasks = useTaskStore((state) => state.tasks);

  // Hàm tính toán thống kê cho từng member
  const getMemberStats = (memberId: number) => {
    const memberTasks = tasks.filter((task) => {
      if (!task.assigned_to) return false;

      const assignedToStr = String(task.assigned_to);

      // Kiểm tra theo ID
      if (assignedToStr.includes(memberId.toString())) return true;

      // Kiểm tra theo tên (fallback)
      const member = teamMembers.find((m) => m.id === memberId);
      if (
        member &&
        assignedToStr.includes(member.full_name_display || member.username)
      )
        return true;

      return false;
    });

    return {
      total: memberTasks.length,
      done: memberTasks.filter((task) => task.status === "DONE").length,
      mr: memberTasks.filter((task) => task.status === "MR").length,
      inProgress: memberTasks.filter((task) => task.status === "inprogress")
        .length,
      incoming: memberTasks.filter((task) => task.status === "incoming").length,
    };
  };

  // Màu sắc cho từng trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "#4caf50"; // Green
      case "mr":
        return "#9c27b0"; // Purple
      case "inProgress":
        return "#ff9800"; // Orange
      case "incoming":
        return "#2196f3"; // Blue
      default:
        return "#757575"; // Grey
    }
  };

  return (
    <Container maxWidth={false} sx={{ my: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Thống kê Team
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {teamMembers.map((member) => {
            const stats = getMemberStats(member.id);

            return (
              <Card
                key={member.id}
                sx={{ height: "100%", border: "1px solid #e0e0e0" }}
              >
                <CardContent>
                  {/* Header với avatar và thông tin cơ bản */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={member.photo}
                      alt={member.full_name_display || member.username}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      {(member.full_name_display || member.username)
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {member.full_name_display || member.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.email}
                      </Typography>
                      {member.date_joined && (
                        <Typography variant="caption" color="text.secondary">
                          Tham gia: {formatDate(member.date_joined)}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Thống kê tổng quan */}
                  <Box mb={2}>
                    <Typography
                      variant="h4"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    >
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng số task
                    </Typography>
                  </Box>

                  {/* Thống kê chi tiết theo trạng thái */}
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">DONE:</Typography>
                      <Chip
                        label={stats.done}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor("done"),
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">MR:</Typography>
                      <Chip
                        label={stats.mr}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor("mr"),
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">In Progress:</Typography>
                      <Chip
                        label={stats.inProgress}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor("inProgress"),
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">Incoming:</Typography>
                      <Chip
                        label={stats.incoming}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor("incoming"),
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Paper>
    </Container>
  );
};

export default TeamPage;
