import { PaginationParams, PaginatedResponse, ApiResponse, SearchParams } from './apiBase';
import { User, UserRole, UserStatus, UserCapability } from '../users';

export interface GetUsersParams extends PaginationParams, SearchParams {
  role?: UserRole;
  status?: UserStatus;
  locationId?: string;
}

export type GetUsersResponse = PaginatedResponse<User>;

export interface GetUserByIdParams {
  userId: string;
}

export type GetUserByIdResponse = ApiResponse<User>;

export interface CreateUserRequest {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  capabilities?: UserCapability[];
  locationId?: string;
  status?: UserStatus;
  password?: string;
  sendInvite?: boolean;
}

export type CreateUserResponse = ApiResponse<User>;

export interface UpdateUserRequest {
  userId: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  capabilities?: UserCapability[];
  locationId?: string;
  status?: UserStatus;
  profileImageUrl?: string;
}

export type UpdateUserResponse = ApiResponse<User>;

export interface DeleteUserParams {
  userId: string;
}

export type DeleteUserResponse = ApiResponse<{deleted: boolean}>;

export interface InviteUserRequest {
  userId: string;
}

export type InviteUserResponse = ApiResponse<{invited: boolean}>;