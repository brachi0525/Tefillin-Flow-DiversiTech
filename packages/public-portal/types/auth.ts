import { UserCapability, UserRole } from "./users";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    capabilities: UserCapability[];
    locationId?: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: AuthUser;
    token: string;
    refreshToken: string;
    expiresAt: number;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  export interface RefreshTokenResponse {
    token: string;
    refreshToken: string;
    expiresAt: number;
  }
  
  export interface PasswordResetRequest {
    email: string;
  }
  
  export interface PasswordResetResponse {
    success: boolean;
    message: string;
  }
  
  export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
  }
  
  export interface ChangePasswordResponse {
    success: boolean;
  }