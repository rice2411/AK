import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Task } from "../../types/Task";

interface YearlyStatsProps {
  tasks: Task[];
}

interface MonthlyData {
  month: string;
  done: number;
  total: number;
}

const YearlyStats: React.FC<YearlyStatsProps> = ({ tasks }) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Tạo dữ liệu theo tháng cho năm được chọn
  const generateYearlyData = (year: number): MonthlyData[] => {
    const monthlyData: MonthlyData[] = [];

    // Tạo 12 tháng cho năm được chọn
    for (let month = 0; month < 12; month++) {
      monthlyData.push({
        month: "Tháng " + (month + 1),
        done: 0,
        total: 0,
      });
    }

    // Phân loại tasks theo tháng trong năm được chọn
    tasks.forEach((task) => {
      // Chỉ sử dụng modified_date, không dùng created_date
      if (!task.modified_date) {
        return; // Bỏ qua task không có modified_date
      }

      const taskDate = new Date(task.modified_date);
      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth();

      // Chỉ xử lý task trong năm được chọn
      if (taskYear !== year) {
        return;
      }

      // Chỉ đếm task có trạng thái DONE
      if (task.status === "DONE") {
        monthlyData[taskMonth].done++;
      }
      monthlyData[taskMonth].total++;
    });

    return monthlyData;
  };

  // Lấy danh sách các năm có task
  const getAvailableYears = (): number[] => {
    const years = new Set<number>();

    tasks.forEach((task) => {
      if (task.modified_date) {
        const taskYear = new Date(task.modified_date).getFullYear();
        years.add(taskYear);
      }
    });

    return Array.from(years).sort((a, b) => b - a); // Sắp xếp giảm dần
  };

  const chartData = generateYearlyData(selectedYear);
  const availableYears = getAvailableYears();

  return (
    <Card sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Thống kê task đã hoàn thành theo năm
          </Typography>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as number)}
              displayEmpty
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: 400, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                height={60}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any, name: string) => [
                  value,
                  name === "done" ? "Task đã hoàn thành" : name,
                ]}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend
                formatter={(value: string) =>
                  value === "done" ? "Task đã hoàn thành" : value
                }
              />
              <Bar dataKey="done" fill="#4caf50" name="done" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default YearlyStats;
