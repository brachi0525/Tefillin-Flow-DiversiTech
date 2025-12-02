import { PaginationParams, PaginatedResponse, ApiResponse, SearchParams } from './apiBase';
import { Location } from '../locations';

export interface GetLocationsParams extends PaginationParams, SearchParams {
  city?: string;
  isActive?: boolean;
}

export type GetLocationsResponse = PaginatedResponse<Location>;

export interface GetLocationByIdParams {
  locationId: string;
}

export type GetLocationByIdResponse = ApiResponse<Location>;

export interface CreateLocationRequest {
  name: string;
  rabbiName: string;
  phone: string;
  address: string;
  city: string;
  isActive?: boolean;
  calendarId?: string;
}

export type CreateLocationResponse = ApiResponse<Location>;

export interface UpdateLocationRequest {
  locationId: string;
  name?: string;
  rabbiName?: string;
  phone?: string;
  address?: string;
  city?: string;
  isActive?: boolean;
  calendarId?: string;
}

export type UpdateLocationResponse = ApiResponse<Location>;

export interface DeleteLocationParams {
  locationId: string;
}

export type DeleteLocationResponse = ApiResponse<{deleted: boolean}>;

export interface GetLocationSoldiersParams extends PaginationParams, SearchParams {
  locationId: string;
  status?: string | string[];
}

export interface GetLocationTefillinParams extends PaginationParams {
  locationId: string;
  status?: string | string[];
}

export interface AssignRabbiToLocationRequest {
  locationId: string;
  userId: string;
}

export type AssignRabbiToLocationResponse = ApiResponse<Location>;