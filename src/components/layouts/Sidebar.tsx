import React from "react";
import { Box, List, ListItemIcon, ListItemText, Divider, Typography, ListItemButton, IconButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => (
  <Box
    sx={{
      width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      height: "100vh",
      background: "#fff",
      borderRight: "1px solid #e0e0e0",
      p: 2,
      zIndex: 999999,
      display: "flex",
      flexDirection: "column",
      color: '#222',
      alignItems: collapsed ? 'center' : 'flex-start',
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), align-items 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  >
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', mb: 2 }}>
      {!collapsed && (
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2" }}>
          AK Tracking
        </Typography>
      )}
      <IconButton size="small" onClick={onToggle} sx={{ ml: collapsed ? 0 : 1 }}>
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </Box>
    <List sx={{ width: '100%' }}>
      <ListItemButton
        component={Link}
        to="/"
        sx={{ justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 2, transition: 'padding 0.3s, justify-content 0.3s' }}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center', transition: 'margin 0.3s' }}>
          <DashboardIcon color="primary" />
        </ListItemIcon>
        <Box
          sx={{
            overflow: 'hidden',
            transition: 'width 0.3s, opacity 0.3s',
            width: collapsed ? 0 : 'auto',
            opacity: collapsed ? 0 : 1,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ListItemText primary="Thống kê" />
        </Box>
      </ListItemButton>
      <ListItemButton
        component={Link}
        to="/team"
        sx={{ justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 2, transition: 'padding 0.3s, justify-content 0.3s' }}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center', transition: 'margin 0.3s' }}>
          <GroupIcon color="primary" />
        </ListItemIcon>
        <Box
          sx={{
            overflow: 'hidden',
            transition: 'width 0.3s, opacity 0.3s',
            width: collapsed ? 0 : 'auto',
            opacity: collapsed ? 0 : 1,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ListItemText primary="Team" />
        </Box>
      </ListItemButton>
    </List>
    <Divider sx={{ my: 2, width: '100%' }} />
    <Box sx={{ flexGrow: 1 }} />
    {!collapsed && (
      <Typography variant="body2" color="#222" align="center">
        © 2024 Rikkeisoft
      </Typography>
    )}
  </Box>
);

export default Sidebar; 