export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface ApiError {
  error: boolean;
  code: 'UPSTREAM_TIMEOUT' | 'NOT_FOUND' | 'RATE_LIMITED' | 'SERVER_ERROR';
  message: string;
  retry: boolean;
}
