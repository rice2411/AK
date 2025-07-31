import { useState, useEffect } from "react";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import TeamPage from "./pages/Team/TeamPage";
import AccountPage from "./pages/Docs/Accounts/AccountPage";
import {
  CircularProgress,
  Box,
  Container,
  Alert,
  Typography,
} from "@mui/material";
import { TaigaService } from "./services/TaigaService";
import { config, validateConfig } from "./config/env";
import { getLocalStorage, setLocalStorage } from "./utils/localStorageUtils";
import type { UserInfo } from "./types/User";
import { useTaskStore } from "./store/taskStore";
import { useTeamStore } from "./store/teamStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AppsPage from "./pages/Docs/Tools/ToolsPage";
import ProjectPage from "./pages/Docs/Project/ProjectPage";
import InternalPage from "./pages/Docs/InternalDocs/InternalDocsPage";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setTasks = useTaskStore((state) => state.setTasks);
  const setTeamMembers = useTeamStore((state) => state.setTeamMembers);

  useEffect(() => {
    const autoLogin = async () => {
      let stored = getLocalStorage<UserInfo>("userInfo");
      if (!stored) {
        const taiga = new TaigaService(config.taiga);
        const ok = await taiga.login(config.taiga.email, config.taiga.password);
        if (ok) {
          stored = taiga.getUserInfo();
          setLocalStorage("userInfo", stored);
        }
      }
      setUserInfo(stored || null);
    };
    autoLogin();
  }, []);

  useEffect(() => {
    validateConfig();
  }, []);

  const teamMembersId = config.team.members;

  useEffect(() => {
    setTeamMembers([]);
    const fetchTeamMembers = async () => {
      try {
        const service = await TaigaService.initialize();
        const userInfos = await Promise.all(
          teamMembersId.map((id) => service.getUserById(id))
        );
        setTeamMembers(userInfos.filter((u): u is UserInfo => Boolean(u)));
      } catch (err) {
        // Có thể log lỗi nếu cần
        console.error(err);
      }
    };
    fetchTeamMembers();
  }, [teamMembersId, setTeamMembers]);

  useEffect(() => {
    const initializeService = async () => {
      try {
        setLoading(true);
        setError(null);
        const service = await TaigaService.initialize();
        const allTasks = await service.getAllTasks(teamMembersId);
        setTasks(allTasks);
      } catch (err) {
        console.error(err);
        setError(
          "Không thể kết nối đến KonyTaiga. Vui lòng kiểm tra lại thông tin đăng nhập."
        );
      } finally {
        setLoading(false);
      }
    };
    initializeService();
  }, [teamMembersId, setTasks]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        minWidth="100vw"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="black" sx={{ mt: 2 }}>
          Đang kết nối đến KonyTaiga...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={2}
          minHeight="100vh"
          minWidth="100vw"
        >
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <MainLayout
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              userInfo={userInfo || undefined}
            />
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/docs/account" element={<AccountPage />} />
          <Route path="/docs/tools" element={<AppsPage />} />
          <Route path="/docs/project" element={<ProjectPage />} />  
          <Route path="/docs/internal" element={<InternalPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
