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
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";

const docs = [
  { name: "Quy trình phát triển phần mềm", type: "Quy trình", url: "https://example.com/quy-trinh" },
  { name: "Hướng dẫn sử dụng Git", type: "Hướng dẫn", url: "https://example.com/git-guide" },
  { name: "Tài liệu onboarding", type: "Onboarding", url: "https://example.com/onboarding" },
];

const columns = ["STT", "Tên tài liệu", "Loại tài liệu", "Đường dẫn"];

const InternalDocsPage: React.FC = () => {
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
        Tài liệu nội bộ
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
            {docs.map((doc, idx) => (
              <TableRow
                key={doc.name}
                sx={{
                  backgroundColor: idx % 2 === 0 ? theme.palette.grey[50] : '#fff',
                  transition: 'background 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell align="center">{idx + 1}</TableCell>
                <TableCell align="center">{doc.name}</TableCell>
                <TableCell align="center">{doc.type}</TableCell>
                <TableCell align="center">
                  <Link href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.url}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InternalDocsPage; 