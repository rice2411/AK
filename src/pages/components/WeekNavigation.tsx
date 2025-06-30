import React from "react";
import { Box, IconButton, Typography, Button, Paper } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import {
  getWeekLabel,
  getPreviousWeek,
  getNextWeek,
  getWeekStart,
  getWeekEnd,
} from "../../utils/dateUtils";

interface WeekNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentDate,
  onDateChange,
}) => {
  const handlePreviousWeek = () => {
    onDateChange(getPreviousWeek(currentDate));
  };

  const handleNextWeek = () => {
    onDateChange(getNextWeek(currentDate));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          onClick={handlePreviousWeek}
          sx={{
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ fontWeight: 600, minWidth: "200px", textAlign: "center" }}
        >
          {getWeekLabel(getWeekStart(currentDate), getWeekEnd(currentDate))}
        </Typography>

        <IconButton
          onClick={handleNextWeek}
          sx={{
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Button
        variant="outlined"
        startIcon={<TodayIcon />}
        onClick={handleToday}
        sx={{
          backgroundColor: "white",
          "&:hover": { backgroundColor: "#e3f2fd" },
        }}
      >
        Hôm nay
      </Button>
    </Paper>
  );
};

export default WeekNavigation;
