import { ApiResponse } from './apiBase';
import { LocationInventoryItem } from '../locations';

export interface GetLocationInventoryParams {
  locationId: string;
}

export type GetLocationInventoryResponse = ApiResponse<LocationInventoryItem>;

export interface UpdateLocationInventoryRequest {
  locationId: string;
  tefillinCount?: number;
  tallitCount?: number;
  kippahCount?: number;
  tanyaCount?: number;
  otherItems?: Record<string, number>;
}

export type UpdateLocationInventoryResponse = ApiResponse<LocationInventoryItem>;

export interface TransferInventoryRequest {
  fromLocationId: string;
  toLocationId: string;
  tefillinCount?: number;
  tallitCount?: number;
  kippahCount?: number;
  tanyaCount?: number;
  otherItems?: Record<string, number>;
}

export type TransferInventoryResponse = ApiResponse<{
  fromInventory: LocationInventoryItem;
  toInventory: LocationInventoryItem;
}>;

export interface InventorySummaryResponse {
  totalTefillin: number;
  totalTallit: number;
  totalKippah: number;
  totalTanya: number;
  otherItems: Record<string, number>;
  byLocation: {
    [locationId: string]: LocationInventoryItem;
  };
}