import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { Task } from "../../../types/Task";
import type { UserInfo } from "../../../types/User";
import { formatDate } from "../../../utils/dateUtils";

interface TeamStatsProps {
  tasks: Task[];
  teamMembers: UserInfo[];
}

interface TaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  member: UserInfo;
  memberTasks: Task[];
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  open,
  onClose,
  member,
  memberTasks,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "#4caf50";
      case "MR":
        return "#9c27b0";
      case "inprogress":
        return "#ff9800";
      case "incoming":
        return "#2196f3";
      default:
        return "#757575";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#f44336";
      case "Critical":
        return "#d32f2f";
      case "Normal":
        return "#2196f3";
      case "Low":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center">
          <Avatar
            src={member.photo}
            alt={member.full_name_display || member.username}
            sx={{ width: 40, height: 40, mr: 2 }}
          >
            {(member.full_name_display || member.username)
              .charAt(0)
              .toUpperCase()}
          </Avatar>
          <Typography variant="h6">
            Chi tiết Task - {member.full_name_display || member.username}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

            <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Tổng số task: <strong>{memberTasks.length}</strong>
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {memberTasks.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            Không có task nào được gán cho member này
          </Typography>
        ) : (
                     <Box sx={{ display: "flex", flexDirection: "column",  gap: 2 }}>
             {/* Cột DONE */}
             <Box>
               <Typography 
                 variant="h6" 
                 sx={{ 
                   mb: 2, 
                   color: getStatusColor("DONE"),
                   fontWeight: 600,
                 }}
               >
                 DONE ({memberTasks.filter(task => task.status === "DONE").length})
               </Typography>
               <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                 {memberTasks
                   .filter(task => task.status === "DONE")
                   .map((task) => (
                     <Box
                       key={task.id}
                       sx={{
                         p: 1,
                         mb: 0.5,
                         border: "1px solid #e0e0e0",
                         borderRadius: 1,
                         backgroundColor: "#f8f9fa",
                         "&:hover": {
                           backgroundColor: "#e3f2fd",
                         }
                       }}
                     >
                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
                         {task.subject}
                       </Typography>
                     </Box>
                   ))}
               </Box>
             </Box>

             {/* Cột MR */}
             <Box>
               <Typography 
                 variant="h6" 
                 sx={{ 
                   mb: 2, 
                   color: getStatusColor("MR"),
                   fontWeight: 600,
                 }}
               >
                 MR ({memberTasks.filter(task => task.status === "MR").length})
               </Typography>
               <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                 {memberTasks
                   .filter(task => task.status === "MR")
                   .map((task) => (
                     <Box
                       key={task.id}
                       sx={{
                         p: 1,
                         mb: 0.5,
                         border: "1px solid #e0e0e0",
                         borderRadius: 1,
                         backgroundColor: "#f8f9fa",
                         "&:hover": {
                           backgroundColor: "#e3f2fd",
                         }
                       }}
                     >
                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
                         {task.subject}
                       </Typography>
                     </Box>
                   ))}
               </Box>
             </Box>

             {/* Cột In Progress & Incoming */}
             <Box>
               <Typography 
                 variant="h6" 
                 sx={{ 
                   mb: 2, 
                   color: getStatusColor("inprogress"),
                   fontWeight: 600,
                 }}
               >
                 In Progress & Incoming ({memberTasks.filter(task => task.status === "inprogress" || task.status === "incoming").length})
               </Typography>
               <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                 {memberTasks
                   .filter(task => task.status === "inprogress" || task.status === "incoming")
                   .map((task) => (
                     <Box
                       key={task.id}
                       sx={{
                         p: 1,
                         mb: 0.5,
                         border: "1px solid #e0e0e0",
                         borderRadius: 1,
                         backgroundColor: "#f8f9fa",
                         "&:hover": {
                           backgroundColor: "#e3f2fd",
                         }
                       }}
                     >
                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
                         {task.subject}
                       </Typography>
                     </Box>
                   ))}
               </Box>
             </Box>
           </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

const TeamStats: React.FC<TeamStatsProps> = ({ tasks, teamMembers }) => {
  const [selectedMember, setSelectedMember] = useState<UserInfo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Tính toán số lượng tasks theo từng member và trạng thái
  const getMemberStats = (memberId: number) => {
    const memberTasks = tasks.filter((task) => {
      // Kiểm tra nếu task có assigned_to
      if (!task.assigned_users?.length) return false;

      // Kiểm tra theo ID
      if (task.assigned_users.includes(memberId)) return true;

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

  // Lấy danh sách task của member
  const getMemberTasks = (memberId: number) => {
    return tasks.filter((task) => {
      if (!task.assigned_users?.length) return false;
      return task.assigned_users.includes(memberId);
    });
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
              const stats = getMemberStats(member.id);

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
