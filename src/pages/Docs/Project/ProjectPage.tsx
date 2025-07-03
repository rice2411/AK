import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";
import { projects } from "../Tools/data";

const columns = [
  "STT",
  "Tên dự án",
  "Độ phổ biến",
  "Tên đăng nhập",
  "Mật khẩu",
  "Nền tảng",
  "Sơ đồ màn hình",
  "Tài liệu",
];

const getPopularityColor = (popularity: number, theme: any) => {
  switch (popularity) {
    case 3:
      return theme.palette.error.main;
    case 2:
      return theme.palette.warning.main;
    case 1:
      return theme.palette.success.main;
    default:
      return theme.palette.grey[400];
  }
};

const ProjectPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mb: 4, p: 4 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h1"
        sx={{
          mb: { xs: 2, md: 3 },
          fontWeight: 600,
          color: "black",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Danh sách dự án
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 2,
          background: "#fff",
          maxWidth: "100%",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col}
                  align="center"
                  sx={{
                    background: theme.palette.grey[100],
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: { xs: 13, md: 15 },
                    borderBottom: `2px solid ${theme.palette.grey[200]}`,
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, idx) => (
              <TableRow
                key={project.name}
                sx={{
                  backgroundColor: idx % 2 === 0 ? theme.palette.grey[50] : '#fff',
                  transition: 'background 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell align="center">{idx + 1}</TableCell>
                <TableCell align="center">{project.name}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={project.popularity}
                    size="small"
                    sx={{
                      backgroundColor: getPopularityColor(project.popularity, theme),
                      color: "white",
                      fontWeight: 700,
                    }}
                  />
                </TableCell>
                <TableCell align="center">{project.username || ""}</TableCell>
                <TableCell align="center">{project.password || ""}</TableCell>
                <TableCell align="center">
                  {project.foundry ? (
                    <Link href={project.foundry} target="_blank" rel="noopener noreferrer">
                      {project.foundry}
                    </Link>
                  ) : ""}
                </TableCell>
                <TableCell align="center">
                  {project.screenMap ? (
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                      {project.screenMap}
                    </Link>
                  ) : ""}
                </TableCell>
                <TableCell align="center">
                  {project.document ? (
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                      {project.document}
                    </Link>
                  ) : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectPage; 