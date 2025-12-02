import { PaginationParams, ApiResponse, DateRangeParams } from './apiBase';
import { Soldier } from '../soldiers';

export interface ScheduleDistributionRequest {
  soldierId: string;
  appointmentDate: Date;
  notes?: string;
}

export type ScheduleDistributionResponse = ApiResponse<{
  soldier: Soldier;
  appointmentId: string;
  calendarEventId?: string;
}>;

export interface RecordDistributionRequest {
  soldierId: string;
  distributionDate: Date;
  notes?: string;
  mediaFiles?: File[];
}

export type RecordDistributionResponse = ApiResponse<Soldier>;

export interface GetUpcomingDistributionsParams extends PaginationParams, DateRangeParams {
  locationId?: string;
}

export interface UpcomingDistribution {
  id: string;
  soldierId: string;
  soldierName: string;
  appointmentDate: Date;
  locationId: string;
  locationName: string;
  tefillinId?: string;
  notes?: string;
}

export interface GetUpcomingDistributionsResponse {
  distributions: UpcomingDistribution[];
  total: number;
  page: number;
  limit: number;
}

export interface CancelDistributionRequest {
  soldierId: string;
  appointmentId: string;
  reason?: string;
}

export type CancelDistributionResponse = ApiResponse<{cancelled: boolean}>;