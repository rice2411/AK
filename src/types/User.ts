export interface UserInfo {
  id: number;
  username: string;
  email: string;
  full_name: string;
  full_name_display: string;
  auth_token: string;
  photo?: string;
}
