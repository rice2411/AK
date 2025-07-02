import React, { useState } from "react";
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
  Collapse,
  Badge,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import DescriptionIcon from "@mui/icons-material/Description";
import HandymanIcon from "@mui/icons-material/Handyman";
import { Link } from "react-router-dom";
import { sidebarItems } from "../../constant/sidebar";
import type { SidebarItem } from "../../constant/sidebar";

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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Dashboard":
        return <DashboardIcon color="primary" />;
      case "Group":
        return <GroupIcon color="primary" />;
      case "MenuBook":
        return <MenuBookIcon color="primary" />;
      case "AccountCircle":
        return <AccountCircleIcon color="primary" />;
      case "Workspaces":
        return <WorkspacesIcon color="primary" />;
      case "Description":
        return <DescriptionIcon color="primary" />;
      case "HandymanIcon":
        return <HandymanIcon color="primary" />;
      default:
        return <DashboardIcon color="primary" />;
    }
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    }
  };

  const isItemExpanded = (itemId: string) => expandedItems.has(itemId);

  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
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
        {sidebarItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItemButton
              component={item.path ? Link : "div"}
              to={item.path}
              onClick={() => handleItemClick(item)}
              sx={{
                justifyContent: collapsed ? "center" : "flex-start",
                minHeight: 48,
                px: collapsed ? 1 : 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? "auto" : 40,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {getIconComponent(item.icon)}
              </ListItemIcon>
              {!collapsed && (
                <>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "space-between",
                        }}
                      >
                        {item.title}
                        {item.badge && (
                          <Badge
                            badgeContent={item.badge}
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  {item.children && item.children.length > 0 && (
                    <IconButton size="small" sx={{ ml: "auto" }}>
                      {isItemExpanded(item.id) ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </IconButton>
                  )}
                </>
              )}
            </ListItemButton>

            {/* Render children */}
            {item.children && item.children.length > 0 && !collapsed && (
              <Collapse
                in={isItemExpanded(item.id)}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.id}
                      component={child.path ? Link : "div"}
                      to={child.path}
                      sx={{
                        pl: 4,
                        minHeight: 40,
                        justifyContent: "flex-start",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {getIconComponent(child.icon)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {child.title}
                            {child.badge && (
                              <Badge
                                badgeContent={child.badge}
                                color="error"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ flexGrow: 1 }} />
      {!collapsed && (
        <Box sx={{ textAlign: "center", color: "#222", fontSize: 13, pb: 1 }}>
          © 2025 Minh Rice
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
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
