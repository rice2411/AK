import React from "react";
import { accountList } from "../Tools/data";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const columns = [
  "STT",
  "Tên",
  "Email",
  "Password",
  "Slack",
  "Git",
  "GoogleAccount",
  "Ref",
];

const AccountPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: 4, mb: 4 }}>
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
        Danh sách tài khoản
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
            {accountList.map((row, idx) => (
              <TableRow key={row.email}>
                <TableCell align="center">{idx + 1}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                </TableCell>
                <TableCell align="center">{row.password}</TableCell>
                <TableCell align="center">{row.slack}</TableCell>
                <TableCell align="center">{row.git}</TableCell>
                <TableCell align="center">{row.googleAccount}</TableCell>
                <TableCell align="center">{row.ref}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccountPage;
