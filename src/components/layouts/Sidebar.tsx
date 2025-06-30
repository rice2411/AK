import React from "react";
import {
  Drawer,
  useMediaQuery,
  useTheme,
  Box,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;

interface SidebarProps {
  open: boolean; // trạng thái mở/đóng trên mobile
  onClose: () => void; // hàm đóng trên mobile
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  collapsed,
  onToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerContent = (
    <Box
      sx={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        mb={2}
      >
        {!collapsed && (
          <Box sx={{ fontWeight: 700, color: "#1976d2" }}>AK Tracking</Box>
        )}
        <IconButton size="small" onClick={onToggle}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <List>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Thống kê" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/team">
          <ListItemIcon>
            <GroupIcon color="primary" />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Team" />}
        </ListItemButton>
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ flexGrow: 1 }} />
      {!collapsed && (
        <Box sx={{ textAlign: "center", color: "#222", fontSize: 13, pb: 1 }}>
          © 2024 Rikkeisoft
        </Box>
      )}
    </Box>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      open
      PaperProps={{
        sx: {
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
