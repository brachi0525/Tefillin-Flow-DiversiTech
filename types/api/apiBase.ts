export interface PaginationParams {
    page?: number;
    limit?: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface ApiError {
    code: string;
    message: string;
    details?: any;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
  }
  
  export interface DateRangeParams {
    fromDate?: string | Date;
    toDate?: string | Date;
  }
  
  export interface SearchParams {
    search?: string;
  }