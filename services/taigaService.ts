import axios, { AxiosInstance } from "axios";
import { Task, UserInfo, ProjectInfo, StatusInfo } from "../types";


// Filter list provided by user
const ALLOWED_USER_IDS = [
  185, 193, 186, 188, 194, 187, 189, 182, 180, 181, 178, 179
];

export class TaigaService {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private userInfo: UserInfo | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.TAIGA_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "x-disable-pagination": "1",
      },
    });
  }

  async login(): Promise<boolean> {
    try {
      const response = await this.client.post("/api/v1/auth", {
        type: "normal",
        username: process.env.TAIGA_EMAIL,
        password: process.env.TAIGA_PASSWORD,
      });

      if (response.data && response.data.auth_token) {
        this.authToken = response.data.auth_token;
        this.client.defaults.headers.common["Authorization"] = `Bearer ${this.authToken}`;

        this.userInfo = {
          id: response.data.id,
          username: response.data.username,
          full_name_display: response.data.full_name_display || response.data.full_name,
          photo: response.data.photo,
          big_photo: response.data.big_photo,
          is_active: true
        };

        // Cache simplified user info
        localStorage.setItem("taiga_auth_token", this.authToken || "");

        return true;
      }
      return false;
    } catch (error) {
      console.error("Taiga Login Error:", error);
      return false;
    }
  }

  async getProjects(): Promise<ProjectInfo[]> {
    try {
      if (!this.authToken) throw new Error("Not logged in");
      const response = await this.client.get("/api/v1/projects");
      return response.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        logo_small_url: p.logo_small_url
      }));
    } catch (error) {
      console.error("Get Projects Error:", error);
      return [];
    }
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      if (!this.authToken) await this.login();
      if (!this.authToken) throw new Error("Authentication failed");

      // Fetch all projects first
      const projects = await this.getProjects();
      let allTasks: Task[] = [];
      // Map to store assigned_users_extra_info by task id
      const assignedUsersInfoMap = new Map<number, Map<number, UserInfo>>();

      // Format ALLOWED_USER_IDS as comma-separated string for API
      const assignedUsersParam = ALLOWED_USER_IDS.join(",");

      // Fetch tasks and user stories for each project
      // Note: In a production environment with many projects, this should be optimized or paginated
      for (const project of projects) {
        // 1. Fetch Tasks
        const tasksResponse = await this.client.get("/api/v1/tasks", {
          params: { project: project.id }
        });
        
        // 2. Fetch User Stories with assigned_users filter
        const storiesResponse = await this.client.get("/api/v1/userstories", {
            params: { 
              assigned_users: assignedUsersParam,
              project: project.id, 
              status__is_archived: "false" 
            }
        });

        // Store assigned_users_extra_info before mapping
        [...tasksResponse.data, ...storiesResponse.data].forEach((item: any) => {
          if (item.assigned_users && item.assigned_users.length > 0 && item.assigned_users_extra_info) {
            const userInfoMap = new Map<number, UserInfo>();
            item.assigned_users_extra_info.forEach((userInfo: any) => {
              if (userInfo && userInfo.id) {
                userInfoMap.set(userInfo.id, this.mapUserInfo(userInfo));
              }
            });
            if (userInfoMap.size > 0) {
              assignedUsersInfoMap.set(item.id, userInfoMap);
            }
          }
        });

        const mappedTasks = tasksResponse.data.map((t: any) => this.mapTaigaItemToTask(t, project));
        const mappedStories = storiesResponse.data.map((s: any) => this.mapTaigaItemToTask(s, project));
        allTasks = [...allTasks, ...mappedTasks, ...mappedStories];

      }

      // Expand tasks with multiple assigned_users
      const expandedTasks: Task[] = [];
      allTasks.forEach(task => {
        // If assigned_users has more than 1 user in ALLOWED_USER_IDS, expand the task
        const allowedAssignedUsers = (task.assigned_users || []).filter((userId: number) => 
          ALLOWED_USER_IDS.includes(userId)
        );
        
        if (allowedAssignedUsers.length > 1) {
          // Get user info map for this task if available
          const userInfoMap = assignedUsersInfoMap.get(task.id);
          
          // Create a task record for each user in assigned_users
          allowedAssignedUsers.forEach((userId: number) => {
            const userInfo = userInfoMap?.get(userId) || null;
            expandedTasks.push({
              ...task,
              assigned_to: userId,
              assigned_to_extra_info: userInfo
            });
          });
        } else if (task.assigned_to && ALLOWED_USER_IDS.includes(task.assigned_to)) {
          // If only one assigned user or using assigned_to, keep the original task
          expandedTasks.push(task);
        } else if (allowedAssignedUsers.length === 1) {
          // If assigned_users has exactly one allowed user, use that
          const userId = allowedAssignedUsers[0];
          const userInfoMap = assignedUsersInfoMap.get(task.id);
          const userInfo = userInfoMap?.get(userId) || null;
          expandedTasks.push({
            ...task,
            assigned_to: userId,
            assigned_to_extra_info: userInfo || task.assigned_to_extra_info
          });
        }
      });

      return expandedTasks;
    } catch (error) {
      console.error("Get All Tasks Error:", error);
      return [];
    }
  }

  private mapTaigaItemToTask(item: any, project: ProjectInfo): Task {
     // Taiga 'status_extra_info' contains the color and name we need
     const statusInfo: StatusInfo = {
        name: item.status_extra_info?.name || 'Unknown',
        color: item.status_extra_info?.color || '#94a3b8',
        is_closed: item.status_extra_info?.is_closed || item.is_closed || false
     };

     // Map Assignee
     // User Stories might have 'assigned_to' or 'assigned_users'. We prioritize 'assigned_to'.
     let assignee: UserInfo | null = null;
     if (item.assigned_to_extra_info) {
        assignee = this.mapUserInfo(item.assigned_to_extra_info);
     } else if (item.assigned_to) {
        // If we have ID but no extra info, we ideally fetch user, but for now leave null or partial
        // Some endpoints don't return extra info. 
     }

     // Map Owner
     const owner = item.owner_extra_info ? this.mapUserInfo(item.owner_extra_info) : {
         id: item.owner,
         username: 'unknown',
         full_name_display: 'Unknown',
         photo: null,
         big_photo: null,
         is_active: false
     };

     return {
        id: item.id,
        subject: item.subject,
        description: item.description,
        created_date: item.created_date,
        modified_date: item.modified_date,
        status: item.status,
        status_extra_info: statusInfo,
        assigned_to: item.assigned_to,
        assigned_to_extra_info: assignee,
        assigned_users: item.assigned_users || [],
        owner: item.owner,
        owner_extra_info: owner,
        project: project.id,
        project_extra_info: project,
        tags: item.tags || [],
        is_closed: item.is_closed,
        is_blocked: item.is_blocked,
        due_date: item.due_date,
        total_comments: item.total_comments || 0 // Sometimes available in list view
     };
  }

  private mapUserInfo(data: any): UserInfo {
      return {
          id: data.id,
          username: data.username,
          full_name_display: data.full_name_display || data.full_name,
          photo: data.photo,
          big_photo: data.big_photo,
          is_active: data.is_active ?? true
      };
  }
}

// Export singleton
export const taigaService = new TaigaService();
