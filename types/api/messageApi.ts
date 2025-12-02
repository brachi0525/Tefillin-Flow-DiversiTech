import { Message } from '../message';
import { PaginationParams, PaginatedResponse, ApiResponse, SearchParams } from './apiBase';

export interface GetMessagesParams extends PaginationParams, SearchParams {
    fromRole?: string;
    toRole?: string;
}

export type GetMessagesResponse = PaginatedResponse<Message>;

export interface GetMessageByIdParams {
    messageId: string;
}

export type GetMessageByIdResponse = ApiResponse<Message>;

export interface CreateMessageRequest {
    content: string;
    fromRole: string;
    toRole: string;
}

export type CreateMessageResponse = ApiResponse<Message>;

export interface UpdateMessageRequest {
    messageId: string;
    content?: string;
    fromRole?: string;
    toRole?: string;
}

export type UpdateMessageResponse = ApiResponse<Message>;

export interface DeleteMessageParams {
    messageId: string;
}

export type DeleteMessageResponse = ApiResponse<{ deleted: boolean }>;