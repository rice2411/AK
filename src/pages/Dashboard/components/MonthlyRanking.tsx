import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  AvatarGroup,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS } from "date-fns/locale";
import type { Task } from "../../../types/Task";
import type { UserInfo } from "../../../types/User";

interface MonthlyRankingProps {
  tasks: Task[];
  teamMembers: UserInfo[];
}

interface UserRankingData {
  userId: number;
  username: string;
  fullName: string;
  photo?: string;
  completedTasks: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  efficiency: number; // Tỷ lệ hoàn thành đúng thời gian
  projects: string[];
  lastActivity: Date | null;
}

const MonthlyRanking: React.FC<MonthlyRankingProps> = ({ tasks, teamMembers }) => {
  const [startMonth, setStartMonth] = useState<Date | null>(
    new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1)
  );
  const [endMonth, setEndMonth] = useState<Date | null>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 0)
  );

  // Tính toán dữ liệu xếp hạng theo khoảng thời gian được chọn
  const rankingData = useMemo((): UserRankingData[] => {
    if (!startMonth || !endMonth) return [];

    const startDate = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);
    const endDate = new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);

    // Lọc tasks trong khoảng thời gian được chọn
    const filteredTasks = tasks.filter((task) => {
      if (!task.modified_date) return false;
      const taskDate = new Date(task.modified_date);
      return taskDate >= startDate && taskDate <= endDate;
    });

    // Nhóm tasks theo user
    const userTasks = new Map<number, Task[]>();
    
    filteredTasks.forEach((task) => {
      // Kiểm tra các trường có thể chứa thông tin user
      if (task.assigned_users && task.assigned_users.length > 0) {
        const userId = task.assigned_users[0];
        if (!userTasks.has(userId)) {
          userTasks.set(userId, []);
        }
        userTasks.get(userId)!.push(task);
      }
    });



    // Tính toán dữ liệu xếp hạng cho từng user
    const ranking: UserRankingData[] = Array.from(userTasks.entries()).map(
      ([userId, userTaskList]) => {
        // Tìm thông tin user từ teamMembers
        const userInfo = teamMembers.find(member => member.id === userId);
        if (!userInfo) return null; // Bỏ qua nếu không tìm thấy user

        const completedTasks = userTaskList.filter(
          (task) => task.status === "DONE"
        ).length;

        const totalEstimatedHours = userTaskList.reduce(
          (sum, task) => sum + (task.estimated_hours || 0),
          0
        );

        const totalActualHours = userTaskList.reduce(
          (sum, task) => sum + (task.actual_hours || 0),
          0
        );

        const efficiency = totalEstimatedHours > 0 
          ? Math.round((totalEstimatedHours / totalActualHours) * 100) 
          : 100;

        const projects = [...new Set(userTaskList.map((task) => task.project))];

        const lastActivity = userTaskList.length > 0 
          ? new Date(Math.max(...userTaskList.map((task) => 
              new Date(task.modified_date || task.created_date).getTime()
            ))
          )
          : null;

        return {
          userId,
          username: userInfo.username,
          fullName: userInfo.full_name_display || userInfo.full_name || userInfo.username,
          photo: userInfo.photo,
          completedTasks,
          totalEstimatedHours,
          totalActualHours,
          efficiency,
          projects,
          lastActivity,
        };
      }
    ).filter(Boolean) as UserRankingData[]; // Lọc bỏ các giá trị null



    // Sắp xếp theo số task hoàn thành giảm dần
    return ranking.sort((a, b) => b.completedTasks - a.completedTasks);
  }, [tasks, startMonth, endMonth]);



  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "success";
    if (efficiency >= 70) return "warning";
    return "error";
  };

  const getEfficiencyLabel = (efficiency: number) => {
    if (efficiency >= 90) return "Tốt";
    if (efficiency >= 70) return "Khá";
    return "Cần cải thiện";
  };

  return (
    <Card sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Bảng xếp hạng theo tháng
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
              <DatePicker
                label="Từ tháng"
                value={startMonth}
                onChange={(newValue) => setStartMonth(newValue)}
                views={["month", "year"]}
                slotProps={{
                  textField: { 
                    size: "small", 
                    sx: { minWidth: 150 },
                    placeholder: "Chọn tháng bắt đầu"
                  },
                }}
                openTo="month"
                disableFuture={false}
              />
              <DatePicker
                label="Đến tháng"
                value={endMonth}
                onChange={(newValue) => setEndMonth(newValue)}
                views={["month", "year"]}
                slotProps={{
                  textField: { 
                    size: "small", 
                    sx: { minWidth: 150 },
                    placeholder: "Chọn tháng kết thúc"
                  },
                }}
                openTo="month"
                disableFuture={false}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {rankingData.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: 1200 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Hạng</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Thành viên</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Task hoàn thành
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Giờ ước tính
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Giờ thực tế
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Hiệu suất
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Dự án tham gia
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Hoạt động gần nhất
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankingData.map((user, index) => (
                  <TableRow
                    key={user.username}
                    sx={{
                      backgroundColor: index < 3 ? "#f8f9fa" : "inherit",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {index < 3 ? (
                          <Chip
                            label={`#${index + 1}`}
                            color={
                              index === 0
                                ? "warning"
                                : index === 1
                                ? "default"
                                : "primary"
                            }
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            #{index + 1}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                                         <TableCell>
                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                         <Avatar
                           src={user.photo}
                           alt={user.fullName}
                           sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
                         >
                           {user.fullName.charAt(0).toUpperCase()}
                         </Avatar>
                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
                           {user.fullName}
                         </Typography>
                       </Box>
                     </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.completedTasks}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {user.totalEstimatedHours.toFixed(1)}h
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {user.totalActualHours.toFixed(1)}h
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${user.efficiency}% - ${getEfficiencyLabel(user.efficiency)}`}
                        color={getEfficiencyColor(user.efficiency) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <AvatarGroup max={3} sx={{ justifyContent: "center" }}>
                        {user.projects.slice(0, 3).map((project, idx) => (
                          <Tooltip key={idx} title={project}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                fontSize: "0.75rem",
                                bgcolor: `hsl(${(idx * 137.5) % 360}, 70%, 50%)`,
                              }}
                            >
                              {project.charAt(0).toUpperCase()}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                      {user.projects.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{user.projects.length - 3}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {user.lastActivity
                          ? user.lastActivity.toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">
              Không có dữ liệu cho khoảng thời gian đã chọn
            </Typography>
          </Box>
        )}

        {startMonth && endMonth && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị dữ liệu từ {formatMonth(startMonth)} đến {formatMonth(endMonth)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyRanking;
