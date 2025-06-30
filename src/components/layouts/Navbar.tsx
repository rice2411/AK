import React from "react";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface NavbarProps {
  sidebarCollapsed: boolean;
  userInfo?: {
    photo?: string;
    full_name_display?: string;
    email?: string;
  };
}

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;

const Navbar: React.FC<NavbarProps> = ({ sidebarCollapsed, userInfo }) => (
  <AppBar
    position="sticky"
    color="primary"
    elevation={2}
    sx={{
      top: 0,
      zIndex: 1201,
      left: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      height: "65px",
    }}
  >
    <Toolbar sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          flexGrow: 1,
          textAlign: 'left',
          // transition: 'text-align 0.2s',
        }}
      >
        AK Task Tracking - KonyTaiga
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {userInfo?.photo ? (
          <Avatar src={userInfo.photo} alt={userInfo.full_name_display} sx={{ width: 32, height: 32 }} />
        ) : (
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
            <PersonIcon sx={{ color: '#fff' }} />
          </Avatar>
        )}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#fff",
            background: "#1976d2",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            ml: 1,
          }}
        >
          {userInfo?.full_name_display || userInfo?.email || "Chưa đăng nhập"}
        </Typography>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Navbar; 