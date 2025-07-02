import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tools } from "./data";

const AppsPage: React.FC = () => {
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
        Ứng dụng dự án
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 3,
        }}
      >
        {tools.map((tool) => (
          <Card
            key={tool.name}
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              textAlign: "center",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px) scale(1.03)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Avatar
                src={tool.img}
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 2,
                  objectFit: "contain",
                }}
                variant="rounded"
              />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {tool.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  lineHeight: 1.5,
                  minHeight: "3em"
                }}
              >
                {tool.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    color: "white"
                  }
                }}
              >
                Truy cập
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AppsPage;
