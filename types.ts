export interface UserInfo {
  id: number;
  username: string;
  full_name_display: string;
  photo: string | null;
  big_photo: string | null;
  is_active: boolean;
}

export interface StatusInfo {
  name: string;
  color: string;
  is_closed: boolean;
}

export interface ProjectInfo {
  id: number;
  name: string;
  slug: string;
  logo_small_url: string | null;
}

export interface Task {
  id: number;
  subject: string;
  description?: string;
  created_date: string;
  modified_date: string;
  status: number;
  status_extra_info: StatusInfo;
  assigned_to: number | null;
  assigned_to_extra_info: UserInfo | null;
  assigned_users: number[];
  owner: number;
  owner_extra_info: UserInfo;
  project: number;
  project_extra_info: ProjectInfo;
  tags: any[];
  is_closed: boolean;
  is_blocked: boolean;
  due_date: string | null;
  total_comments: number;
}

export interface AIResponse {
  analysis: string;
}

export enum ModalType {
  NONE,
  ADD_TASK,
  AI_INSIGHT,
}
