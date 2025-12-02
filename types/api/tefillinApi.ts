import { PaginationParams, PaginatedResponse, ApiResponse, SearchParams } from './apiBase';
import { Tefillin, TefillinStatus } from '../tefillin';

export interface GetTefillinParams extends PaginationParams, SearchParams {
  status?: TefillinStatus | TefillinStatus[];
  locationId?: string;
  soldierId?: string;
  barcode?: string;
}

export type GetTefillinResponse = PaginatedResponse<Tefillin>;

export interface GetTefillinByIdParams {
  tefillinId: string;
}

export type GetTefillinByIdResponse = ApiResponse<Tefillin>;

export interface CreateTefillinRequest {
  barcode: string;
  scribeName?: string;
  checkerName?: string;
  productionDate?: Date;
  status: TefillinStatus;
  locationId?: string;
  donorID?: string;
  donorName?: string;
  inMemoryOf?: string;
}

export type CreateTefillinResponse = ApiResponse<Tefillin>;

export interface UpdateTefillinRequest {
  tefillinId: string;
  barcode?: string;
  scribeName?: string;
  checkerName?: string;
  productionDate?: Date;
  status?: TefillinStatus;
  locationId?: string;
  donorID?: string;
  donorName?: string;
  inMemoryOf?: string;
}

export type UpdateTefillinResponse = ApiResponse<Tefillin>;

export interface ChangeTefillinStatusRequest {
  tefillinId: string;
  status: TefillinStatus;
  locationId?: string;
}

export type ChangeTefillinStatusResponse = ApiResponse<Tefillin>;

export interface AddTefillinImageRequest {
  tefillinId: string;
  file: File;
}

export type AddTefillinImageResponse = ApiResponse<Tefillin>;

export interface DeleteTefillinImageRequest {
  tefillinId: string;
  imageUrl: string;
}

export type DeleteTefillinImageResponse = ApiResponse<Tefillin>;

export interface ScanTefillinBarcodeRequest {
  barcode: string;
}

export type ScanTefillinBarcodeResponse = ApiResponse<Tefillin>;