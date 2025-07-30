import React from "react";
import {
  Typography,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { Task } from "../../../types/Task";
import type { UserInfo } from "../../../types/User";
import { PENTDING_TASK_ID } from "../../../constant/pending";

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
      case "pending":
        return "#d32f2f";
      default:
        return "#757575";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                DONE (
                {memberTasks.filter((task) => task.status === "DONE").length})
              </Typography>
              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {memberTasks
                  .filter((task) => task.status === "DONE")
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
                        },
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
                MR ({memberTasks.filter((task) => task.status === "MR").length})
              </Typography>
              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {memberTasks
                  .filter((task) => task.status === "MR")
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
                        },
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
                In Progress & Incoming (
                {
                  memberTasks.filter(
                    (task) =>
                      task.status === "inprogress" || task.status === "incoming"
                  ).length
                }
                )
              </Typography>
              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {memberTasks
                  .filter(
                    (task) =>
                      task.status === "inprogress" || task.status === "incoming"
                  )
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
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {task.subject}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: getStatusColor("pending"),
                  fontWeight: 600,
                }}
              >
                Pending ({memberTasks.filter((task) => PENTDING_TASK_ID.includes(task.id)).length})
              </Typography>
              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {memberTasks
                  .filter((task) => PENTDING_TASK_ID.includes(task.id))
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
                        },
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

export default TaskDetailDialog;