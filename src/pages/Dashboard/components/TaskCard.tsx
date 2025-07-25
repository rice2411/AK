import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

import type { Task } from "../../../types/Task";
import { getPriorityColor, getStatusColor } from "../../../utils/taskUtils";
import { formatDateTime , formatDate} from "../../../utils/dateUtils";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <Card
      sx={{
        mb: 2,
        border: "1px solid #e0e0e0",
        "&:hover": {
          boxShadow: 3,
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h3"
          sx={{ fontWeight: 600, flex: 1 }}
        >
          {task.subject}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: "40px" }}
        >
          {task.description}
        </Typography>

        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            label={task.status}
            size="small"
            sx={{
              backgroundColor: statusColor,
              color: "white",
              fontWeight: 500,
            }}
          />
          <Chip
            label={task.priority}
            size="small"
            sx={{
              backgroundColor: priorityColor,
              color: "white",
              fontWeight: 500,
            }}
          />
          {task.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {task.assigned_to || "Chưa phân công"}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {task.project}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Tạo: {formatDate(task.created_date)}
            </Typography>
          </Box>
          {task.finished_date && (
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircleIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main">
                Hoàn thành: {formatDate(task.finished_date)}
              </Typography>
            </Box>
          )}
        </Box>

        {task.due_date && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ScheduleIcon fontSize="small" color="warning" />
            <Typography variant="body2" color="warning.main">
              Hạn: {formatDateTime(task.due_date)}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Ước tính: {task.estimated_hours || 0}h
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thực tế: {task.actual_hours || 0}h
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
