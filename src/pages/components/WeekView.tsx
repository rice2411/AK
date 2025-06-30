import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import WeeklyStats from "./WeeklyStats";
import type { WeekData } from "../../types/WeekData";

interface WeekViewProps {
  weekData: WeekData;
}

const WeekView: React.FC<WeekViewProps> = ({ weekData }) => {
  const [expanded, setExpanded] = React.useState(true);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Chi tiết tuần
          </Typography>
          <IconButton onClick={handleToggleExpand}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box>
            <WeeklyStats weekData={weekData} />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default WeekView;
