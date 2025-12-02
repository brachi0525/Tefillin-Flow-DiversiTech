import { PaginationParams, PaginatedResponse, ApiResponse, DateRangeParams } from './apiBase';
import { PublicFeedItem, FeedItemType } from '../publicFeed';

export interface GetPublicFeedParams extends PaginationParams, DateRangeParams {
  type?: FeedItemType;
  locationId?: string;
}

export type GetPublicFeedResponse = PaginatedResponse<PublicFeedItem>;

export interface GetPublicFeedItemParams {
  feedItemId: string;
}

export type GetPublicFeedItemResponse = ApiResponse<PublicFeedItem>;

export interface CreatePublicFeedItemRequest {
  type: FeedItemType;
  title: string;
  content: string;
  mediaUrls?: string[];
  soldierName?: string;
  locationName?: string;
  publishedDate?: Date;
}

export type CreatePublicFeedItemResponse = ApiResponse<PublicFeedItem>;

export interface UpdatePublicFeedItemRequest {
  feedItemId: string;
  title?: string;
  content?: string;
  mediaUrls?: string[];
  soldierName?: string;
  locationName?: string;
  publishedDate?: Date;
}

export type UpdatePublicFeedItemResponse = ApiResponse<PublicFeedItem>;

export interface DeletePublicFeedItemParams {
  feedItemId: string;
}

export type DeletePublicFeedItemResponse = ApiResponse<{deleted: boolean}>;

export interface AddMediaToFeedRequest {
  feedItemId: string;
  file: File;
}

export type AddMediaToFeedResponse = ApiResponse<PublicFeedItem>;

export interface RemoveMediaFromFeedRequest {
  feedItemId: string;
  mediaUrl: string;
}

export type RemoveMediaFromFeedResponse = ApiResponse<PublicFeedItem>;