export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: CurrentUser;
  token: string;
}
