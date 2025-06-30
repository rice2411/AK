import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo?: {
    photo?: string;
    full_name_display?: string;
    email?: string;
  };
}

const MainLayout: React.FC<MainLayoutProps> = ({ collapsed, setCollapsed, userInfo }) => {
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: '#f5f6fa', overflowX: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <Box
        sx={{
          position: 'relative',
          transform: `translateX(${sidebarWidth}px)`,
          width: `calc(100vw - ${sidebarWidth}px)`,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Navbar sidebarCollapsed={collapsed} userInfo={userInfo} />
        <Box sx={{ p: 0,width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 