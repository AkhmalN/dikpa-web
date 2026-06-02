export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface MetaResponse {
  total: number;
  limit: number;
  skip: number;
  page: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: MetaResponse;
}

export interface ListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  [key: string]: unknown;
}
