export declare enum ErrorCode {
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
    TIMEOUT_ERROR = "TIMEOUT_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    NOT_FOUND = "NOT_FOUND",
    ALREADY_EXISTS = "ALREADY_EXISTS",
    CONFLICT = "CONFLICT",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    RATE_LIMITED = "RATE_LIMITED"
}
export declare class AppError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly details?: any;
    constructor(message: string, code?: ErrorCode, statusCode?: number, isOperational?: boolean, details?: any);
}
export declare class ValidationError extends AppError {
    constructor(message: string, field?: string, details?: any);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string, details?: any);
}
export declare class ConflictError extends AppError {
    constructor(message: string, details?: any);
}
export declare class NetworkError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class TimeoutError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class RateLimitError extends AppError {
    constructor(message?: string, details?: any);
}
export declare function isAppError(error: any): error is AppError;
export declare function getErrorCode(error: unknown): ErrorCode;
export declare function getErrorMessage(error: unknown): string;
export declare function getErrorDetails(error: unknown): any;
export declare function logError(error: unknown, context?: string): void;
export declare function handleError(error: unknown, context?: string): AppError;
export declare function withErrorHandling<T extends any[], R>(fn: (...args: T) => Promise<R>, context?: string): (...args: T) => Promise<R>;
export declare function withRetry<T>(fn: () => Promise<T>, maxRetries?: number, baseDelay?: number, maxDelay?: number): Promise<T>;
//# sourceMappingURL=errors.d.ts.map