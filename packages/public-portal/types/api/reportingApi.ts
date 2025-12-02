import { ApiResponse, DateRangeParams } from './apiBase';

export interface GetDashboardStatsParams extends DateRangeParams {
  locationId?: string;
}

export interface DashboardStats {
  soldierCounts: {
    total: number;
    byStatus: Record<string, number>;
  };
  distributionStats: {
    total: number;
    recent: number;
    upcoming: number;
  };
  inventorySummary: {
    tefillin: number;
    tallit: number;
    kippah: number;
    tanya: number;
  };
  locationActivity: {
    locationId: string;
    locationName: string;
    count: number;
  }[];
  timeline: {
    date: string;
    count: number;
  }[];
}

export type GetDashboardStatsResponse = ApiResponse<DashboardStats>;

export interface GetSoldierReportParams extends DateRangeParams {
  locationId?: string;
  status?: string | string[];
}

export interface SoldierReport {
  totalSoldiers: number;
  statuses: {
    status: string;
    count: number;
    percentage: number;
  }[];
  byLocation: {
    locationId: string;
    locationName: string;
    count: number;
    percentage: number;
  }[];
  timeline: {
    date: string;
    registered: number;
    distributed: number;
  }[];
}

export type GetSoldierReportResponse = ApiResponse<SoldierReport>;

export interface GetTefillinReportParams extends DateRangeParams {
  status?: string | string[];
}

export interface TefillinReport {
  totalTefillin: number;
  statuses: {
    status: string;
    count: number;
    percentage: number;
  }[];
  byLocation: {
    locationId: string;
    locationName: string;
    count: number;
    percentage: number;
  }[];
  timeline: {
    date: string;
    produced: number;
    distributed: number;
  }[];
}

export type GetTefillinReportResponse = ApiResponse<TefillinReport>;