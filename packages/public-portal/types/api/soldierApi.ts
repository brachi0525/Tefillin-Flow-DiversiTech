import { PaginationParams, PaginatedResponse, ApiResponse, SearchParams, DateRangeParams } from './apiBase';
import { Soldier, SoldierStatus } from '../soldiers';
import { PaymentMethod } from '../payments';
import { MediaType } from '../media';
import { CommentCategory } from '../comments';

export interface GetSoldiersParams extends PaginationParams, SearchParams, DateRangeParams {
  status?: SoldierStatus | SoldierStatus[];
  locationId?: string;
}

export type GetSoldiersResponse = PaginatedResponse<Soldier>;

export interface GetSoldierByIdParams {
  soldierId: string;
}

export type GetSoldierByIdResponse = ApiResponse<Soldier>;

export interface RegisterSoldierRequest {
  name: string;
  phone: string;
  email?: string;
  address: string;
  mothersName?: string;
  dominantHand: "right" | "left";
  formFillerName?: string;
  formFillerPhone?: string;
  formFillerRelationship?: string;
}

export type RegisterSoldierResponse = ApiResponse<Soldier>;

export interface UpdateSoldierRequest {
  soldierId: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  mothersName?: string;
  dominantHand?: "right" | "left";
  formFillerName?: string;
  formFillerPhone?: string;
  formFillerRelationship?: string;
  nextContactDate?: Date;
}

export type UpdateSoldierResponse = ApiResponse<Soldier>;

export interface ChangeSoldierStatusRequest {
  soldierId: string;
  status: SoldierStatus;
  notes?: string;
}

export type ChangeSoldierStatusResponse = ApiResponse<Soldier>;

export interface AssignSoldierLocationRequest {
  soldierId: string;
  locationId: string;
}

export type AssignSoldierLocationResponse = ApiResponse<Soldier>;

export interface AssignTefillinToSoldierRequest {
  soldierId: string;
  tefillinId: string;
}

export type AssignTefillinToSoldierResponse = ApiResponse<Soldier>;

export interface AddSoldierPaymentRequest {
  soldierId: string;
  amount: number;
  method: PaymentMethod;
  notes?: string;
  receiptUrl?: string;
}

export type AddSoldierPaymentResponse = ApiResponse<Soldier>;

export interface AddSoldierMediaRequest {
  soldierId: string;
  type: MediaType;
  file: File;
  caption?: string;
  isPublishable?: boolean;
}

export type AddSoldierMediaResponse = ApiResponse<Soldier>;

export interface UpdateSoldierMediaRequest {
  soldierId: string;
  mediaId: string;
  caption?: string;
  isPublishable?: boolean;
}

export type UpdateSoldierMediaResponse = ApiResponse<Soldier>;

export interface DeleteSoldierMediaRequest {
  soldierId: string;
  mediaId: string;
}

export type DeleteSoldierMediaResponse = ApiResponse<{deleted: boolean}>;

export interface AddSoldierCommentRequest {
  soldierId: string;
  content: string;
  category?: CommentCategory;
  visibleToAll?: boolean;
}

export type AddSoldierCommentResponse = ApiResponse<Soldier>;

export interface DeleteSoldierCommentRequest {
  soldierId: string;
  commentId: string;
}

export type DeleteSoldierCommentResponse = ApiResponse<{deleted: boolean}>;