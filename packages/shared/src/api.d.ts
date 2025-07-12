export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    code?: string;
    timestamp?: string;
}
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface ApiError {
    code: string;
    message: string;
    details?: any;
    field?: string;
}
export declare function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T>;
export declare function createErrorResponse(error: string, code?: string, details?: any): ApiResponse;
export declare function createPaginatedResponse<T>(data: T[], pagination: {
    page: number;
    limit: number;
    total: number;
}, message?: string): PaginatedResponse<T>;
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly BAD_GATEWAY: 502;
    readonly SERVICE_UNAVAILABLE: 503;
};
export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    retries?: number;
    retryDelay?: number;
}
export interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
    signal?: AbortSignal;
}
export interface ApiClient {
    get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
    post<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>>;
    put<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>>;
    patch<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>>;
    delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}
export declare function isApiError(error: any): error is ApiError;
export declare function getErrorMessage(error: unknown): string;
export declare function validateApiResponse<T>(response: any): ApiResponse<T>;
//# sourceMappingURL=api.d.ts.map