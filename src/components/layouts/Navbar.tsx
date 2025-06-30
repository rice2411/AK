import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";

interface NavbarProps {
  sidebarCollapsed: boolean;
  userInfo?: {
    photo?: string;
    full_name_display?: string;
    email?: string;
  };
  onOpenSidebarMobile?: () => void;
  noLeft?: boolean;
}

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;

const Navbar: React.FC<NavbarProps> = ({
  sidebarCollapsed,
  userInfo,
  onOpenSidebarMobile,
  noLeft,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={2}
      sx={{
        top: 0,
        zIndex: 1201,
        left: noLeft
          ? 0
          : isMobile
          ? 0
          : sidebarCollapsed
          ? SIDEBAR_COLLAPSED_WIDTH
          : SIDEBAR_WIDTH,
        height: "65px",
        transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Toolbar sx={{ width: "100%" }}>
        {/* Nút toggle sidebar cho mobile */}
        {isMobile && onOpenSidebarMobile && (
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            onClick={onOpenSidebarMobile}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: "left",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          AK Task Tracking - KonyTaiga
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {userInfo?.photo ? (
            <Avatar
              src={userInfo.photo}
              alt={userInfo.full_name_display}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}>
              <PersonIcon sx={{ color: "#fff" }} />
            </Avatar>
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#fff",
              background: "#1976d2",
              py: 0.5,
              borderRadius: 2,
              ml: 1,
              display: { xs: "none", sm: "block" },
            }}
          >
            {userInfo?.full_name_display || userInfo?.email || "Chưa đăng nhập"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
