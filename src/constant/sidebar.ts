export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;

export interface SidebarItem {
  id: string;
  title: string;
  icon: string; // Sử dụng tên icon, render ở component
  path?: string;
  children?: SidebarItem[];
  badge?: number;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    title: "Thống kê",
    icon: "Dashboard",
    path: "/",
  },
  {
    id: "team",
    title: "Team",
    icon: "Group",
    path: "/team",
  },
  {
    id: "docs",
    title: "Tài liệu",
    icon: "MenuBook",
    children: [
      {
        id: "account",
        title: "Tài khoản",
        icon: "AccountCircle",
        path: "/docs/account",
      },
      {
        id: "apps",
        title: "Ứng dụng",
        icon: "Apps",
        path: "/docs/apps",
      },
      {
        id: "project",
        title: "Dự án",
        icon: "Workspaces",
        path: "/docs/project",
      },
      {
        id: "internal",
        title: "Tài liệu nội bộ",
        icon: "Description",
        path: "/docs/internal",
      },
    ],
  },
];
