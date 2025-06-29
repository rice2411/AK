import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Task } from "../types/Task";
import type { Project } from "../types/Project";
import { TaskStatus, TaskPriority } from "../types/Task";
import type { TaigaConfig } from "../types/Config";
import type { UserInfo } from "../types/User";
import { config } from "../config/env";

export class TaigaService {
  private config: TaigaConfig;
  private client: AxiosInstance;
  private authToken: string | null = null;
  private userInfo: UserInfo | null = null;

  constructor(config: TaigaConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "x-disable-pagination": "1", // Disable pagination để lấy tất cả data
      },
    });
  }

  // Đăng nhập tự động vào KonyTaiga
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await this.client.post("/api/v1/auth", {
        type: "normal",
        username: email,
        password: password,
      });

      if (response.data && response.data.auth_token) {
        this.authToken = response.data.auth_token;
        this.client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${this.authToken}`;

        // Lưu thông tin user vào localStorage
        this.userInfo = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          full_name: response.data.full_name,
          full_name_display: response.data.full_name_display,
          auth_token: response.data.auth_token || "",
          photo: response.data.photo,
        };

        localStorage.setItem("taiga_user_info", JSON.stringify(this.userInfo));
        localStorage.setItem("taiga_auth_token", this.authToken || "");

        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return false;
    }
  }

  // Lấy thông tin user từ localStorage
  getUserInfo(): UserInfo | null {
    if (this.userInfo) {
      return this.userInfo;
    }

    const storedUserInfo = localStorage.getItem("taiga_user_info");
    if (storedUserInfo) {
      this.userInfo = JSON.parse(storedUserInfo);
      return this.userInfo;
    }

    return null;
  }

  // Kiểm tra xem đã đăng nhập chưa
  isLoggedIn(): boolean {
    const token = localStorage.getItem("taiga_auth_token");
    return !!token;
  }

  // Đăng xuất
  logout(): void {
    this.authToken = null;
    this.userInfo = null;
    localStorage.removeItem("taiga_user_info");
    localStorage.removeItem("taiga_auth_token");
    delete this.client.defaults.headers.common["Authorization"];
  }

  // Lấy danh sách projects
  async getProjects(): Promise<Project[]> {
    try {
      if (!this.authToken) {
        throw new Error("Chưa đăng nhập");
      }

      const response = await this.client.get("/api/v1/projects");
      return response.data.map((project: any) => ({
        id: project.id,
        name: project.name,
        slug: project.slug,
      }));
    } catch (error) {
      console.error("Lỗi lấy danh sách projects:", error);
      return [];
    }
  }

  // Lấy danh sách tasks từ project
  async getTasks(projectId: number, filters?: any): Promise<Task[]> {
    try {
      if (!this.authToken) {
        throw new Error("Chưa đăng nhập");
      }

      const params = new URLSearchParams({
        project: projectId.toString(),
      });

      // Thêm các filters khác
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await this.client.get(`/api/v1/tasks?${params}`);

      const mappedTasks = response.data.map((task: any) =>
        this.mapTaigaTaskToAppTask(task)
      );

      return mappedTasks;
    } catch (error) {
      console.error("Lỗi lấy danh sách tasks:", error);
      return [];
    }
  }

  // Lấy tasks theo khoảng thời gian và assigned_to
  async getTasksByDateRange(
    projectId: number,
    startDate: string,
    endDate: string,
    assignedToIds?: number[]
  ): Promise<Task[]> {
    try {
      if (!this.authToken) {
        throw new Error("Chưa đăng nhập");
      }

      const params = new URLSearchParams({
        project: projectId.toString(),
        created_date__gte: startDate,
        created_date__lte: endDate,
      });

      // Thêm filter theo assigned_to nếu có
      if (assignedToIds && assignedToIds.length > 0) {
        assignedToIds.forEach((id) => {
          params.append("assigned_to", id.toString());
        });
      }

      const response = await this.client.get(`/api/v1/tasks?${params}`);

      const mappedTasks = response.data.map((task: any) =>
        this.mapTaigaTaskToAppTask(task)
      );

      return mappedTasks;
    } catch (error) {
      console.error("Lỗi lấy tasks theo khoảng thời gian:", error);
      return [];
    }
  }

  // Lấy user stories theo assigned_users
  async getUserStories(
    projectId: number,
    assignedUserIds?: number[]
  ): Promise<Task[]> {
    try {
      if (!this.authToken) {
        throw new Error("Chưa đăng nhập");
      }

      const params = new URLSearchParams({
        project: projectId.toString(),
        status__is_archived: "false",
      });

      // Thêm filter theo assigned_users nếu có
      if (assignedUserIds && assignedUserIds.length > 0) {
        params.append("assigned_users", assignedUserIds.join(","));
      }

      const response = await this.client.get(`/api/v1/userstories?${params}`);

      const mappedUserStories = response.data.map((userStory: any) =>
        this.mapTaigaUserStoryToAppTask(userStory)
      );

      return mappedUserStories;
    } catch (error) {
      console.error("Lỗi lấy user stories:", error);
      return [];
    }
  }

  // Lấy tất cả tasks và user stories từ tất cả projects với filter theo assigned_to
  async getAllTasks(assignedToIds?: number[]): Promise<Task[]> {
    try {
      if (!this.authToken) {
        throw new Error("Chưa đăng nhập");
      }

      const projects = await this.getProjects();
      let allTasks: Task[] = [];

      for (const project of projects) {
        // Lấy tasks từ project
        const projectTasks = await this.getTasks(
          project.id,
          assignedToIds ? { assigned_to: assignedToIds.join(",") } : undefined
        );

        // Lấy user stories từ project
        const projectUserStories = await this.getUserStories(
          project.id,
          assignedToIds
        );

        allTasks = [...allTasks, ...projectTasks, ...projectUserStories];
      }

      return allTasks;
    } catch (error) {
      console.error("Lỗi lấy tất cả tasks:", error);
      return [];
    }
  }

  // Chuyển đổi task từ Taiga format sang app format
  private mapTaigaTaskToAppTask(taigaTask: any): Task {
    const statusName = taigaTask.status_extra_info?.name || taigaTask.status;

    return {
      id: taigaTask.id,
      subject: taigaTask.subject,
      description: taigaTask.description || "",
      status: this.mapTaigaStatusToAppStatus(statusName) as any,
      priority: this.mapTaigaPriorityToAppPriority(
        taigaTask.priority_extra_info?.name || taigaTask.priority
      ) as any,
      created_date: taigaTask.created_date,
      modified_date: taigaTask.modified_date,
      finished_date: taigaTask.finished_date,
      due_date: taigaTask.due_date,
      assigned_to:
        taigaTask.assigned_to_extra_info?.full_name_display ||
        taigaTask.assigned_to ||
        "",
      project: taigaTask.project_extra_info?.name || taigaTask.project || "",
      tags: taigaTask.tags || [],
      estimated_hours: taigaTask.total_points || 0,
      actual_hours: taigaTask.total_points || 0,
    };
  }

  // Chuyển đổi status từ Taiga sang app
  private mapTaigaStatusToAppStatus(taigaStatus: string): string {
    const statusMap: { [key: string]: string } = {
      done: TaskStatus.DONE,
      Done: TaskStatus.DONE,
      Closed: TaskStatus.DONE,
      MR: TaskStatus.MR,
      "Ready for test": TaskStatus.MR,
      Testing: TaskStatus.MR,
      "In progress": TaskStatus.IN_PROGRESS,
      "In Progress": TaskStatus.IN_PROGRESS,
      "In Coming": TaskStatus.INCOMING,
      New: TaskStatus.INCOMING,
      Ready: TaskStatus.INCOMING,
    };

    return statusMap[taigaStatus] || TaskStatus.INCOMING;
  }

  // Chuyển đổi priority từ Taiga sang app
  private mapTaigaPriorityToAppPriority(taigaPriority: string): string {
    const priorityMap: { [key: string]: string } = {
      Low: TaskPriority.LOW,
      Normal: TaskPriority.NORMAL,
      High: TaskPriority.HIGH,
      Critical: TaskPriority.CRITICAL,
    };
    return priorityMap[taigaPriority] || TaskPriority.NORMAL;
  }

  // Chuyển đổi user story từ Taiga format sang app format
  private mapTaigaUserStoryToAppTask(userStory: any): Task {
    const statusName = userStory.status_extra_info?.name || userStory.status;

    return {
      id: userStory.id,
      subject: userStory.subject,
      description: userStory.description || "",
      status: this.mapTaigaStatusToAppStatus(statusName) as any,
      priority: this.mapTaigaPriorityToAppPriority(
        userStory.priority_extra_info?.name || userStory.priority
      ) as any,
      created_date: userStory.created_date,
      modified_date: userStory.modified_date,
      finished_date: userStory.finished_date,
      due_date: userStory.due_date,
      assigned_to:
        userStory.assigned_users
          ?.map((user: any) => user.full_name_display)
          .join(", ") ||
        userStory.assigned_to ||
        "",
      project: userStory.project_extra_info?.name || userStory.project || "",
      tags: userStory.tags || [],
      estimated_hours: userStory.total_points || 0,
      actual_hours: userStory.total_points || 0,
    };
  }

  // Khởi tạo service với đăng nhập tự động
  static async initialize(): Promise<TaigaService> {
    const service = new TaigaService({
      baseUrl: config.taiga.baseUrl,
    });

    // Đăng nhập tự động
    const loginSuccess = await service.login(
      config.taiga.email,
      config.taiga.password
    );

    if (!loginSuccess) {
      console.error("Không thể đăng nhập vào KonyTaiga");
      throw new Error("Đăng nhập thất bại");
    }

    return service;
  }
}
