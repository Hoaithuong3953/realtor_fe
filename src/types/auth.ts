import type { AuthUserOut } from "./user";

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string; // usually "bearer"
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUserOut;
  tokens: TokenPair;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}
