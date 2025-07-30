import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import type { Task } from "../../../types/Task";
import type { UserInfo } from "../../../types/User";
import TaskDetailDialog from "./TaskDetailDialog";
import { useTaskStore } from "../../../store/taskStore";
import { PENTDING_TASK_ID } from "../../../constant/pending";

interface TeamStatsProps {
  tasks: Task[];
  teamMembers: UserInfo[];
}

const TeamStats: React.FC<TeamStatsProps> = ({ tasks, teamMembers }) => {
  const [selectedMember, setSelectedMember] = useState<UserInfo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Cache kết quả để tránh tính toán lại
  const noPendingTasks = useMemo(() => {
    const getNoPendingTasks = useTaskStore.getState().getNoPendingTasks;
    return getNoPendingTasks(tasks);
  }, [tasks]);

  // Tính toán stats cho tất cả members một lần
  const memberStats = useMemo(() => {
    const stats: Record<number, {
      total: number;
      done: number;
      mr: number;
      inProgressAndIncoming: number;
      pending: number;
    }> = {};

    teamMembers.forEach((member) => {
      const memberTasks = tasks.filter((task) => {
        if (!task.assigned_users?.length) return false;
        return task.assigned_users.includes(member.id);
      });

      const pendingTasks = tasks.filter((task) => 
        task.assigned_users?.includes(member.id) && PENTDING_TASK_ID.includes(task.id)
      );

      stats[member.id] = {
        total: memberTasks.length,
        done: memberTasks.filter((task) => task.status === "DONE").length,
        mr: memberTasks.filter((task) => task.status === "MR").length,
        inProgressAndIncoming: memberTasks.filter(
          (task) => !PENTDING_TASK_ID.includes(task.id) && (task.status === "inprogress" || task.status === "incoming")
        ).length,
        pending: pendingTasks.length,
      };
    });

    return stats;
  }, [tasks, teamMembers, noPendingTasks]);

  // Lấy danh sách task của member
  const getMemberTasks = useMemo(() => {
    return (memberId: number) => {
      return tasks.filter((task) => {
        if (!task.assigned_users?.length) return false;
        return task.assigned_users.includes(memberId);
      });
    };
  }, [tasks]);

  // Màu sắc cho từng trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "#4caf50"; // Green
      case "mr":
        return "#9c27b0"; // Purple
      case "inProgressAndIncoming":
        return "#ff9800"; // Orange
      case "pending":
        return "#d32f2f"; // Red
      default:
        return "#757575"; // Grey
    }
  };

  const handleCardClick = (member: UserInfo) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
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
              const stats = memberStats[member.id];
              return (
                <Card
                  key={member.id}
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fafafa",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                  onClick={() => handleCardClick(member)}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={member.photo}
                      alt={member.full_name_display || member.username}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    >
                      {(member.full_name_display || member.username)
                        .charAt(0)
                        .toUpperCase()}
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
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">Pending:</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: getStatusColor("pending") }}
                      >
                        {stats.pending}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {selectedMember && (
        <TaskDetailDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          member={selectedMember}
          memberTasks={getMemberTasks(selectedMember.id)}
        />
      )}
    </>
  );
};

export default TeamStats;
