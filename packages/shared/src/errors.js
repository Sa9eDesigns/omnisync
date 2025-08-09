// Error handling utilities and custom error classes
export var ErrorCode;
(function (ErrorCode) {
    // Generic errors
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    ErrorCode["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
    // Validation errors
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    // Authentication errors
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    ErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    // Resource errors
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["ALREADY_EXISTS"] = "ALREADY_EXISTS";
    ErrorCode["CONFLICT"] = "CONFLICT";
    // Server errors
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    ErrorCode["RATE_LIMITED"] = "RATE_LIMITED";
})(ErrorCode || (ErrorCode = {}));
export class AppError extends Error {
    code;
    statusCode;
    isOperational;
    details;
    constructor(message, code = ErrorCode.UNKNOWN_ERROR, statusCode = 500, isOperational = true, details) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message, field, details) {
        super(message, ErrorCode.VALIDATION_ERROR, 400, true, { field, ...details });
    }
}
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed', details) {
        super(message, ErrorCode.UNAUTHORIZED, 401, true, details);
    }
}
export class AuthorizationError extends AppError {
    constructor(message = 'Access denied', details) {
        super(message, ErrorCode.FORBIDDEN, 403, true, details);
    }
}
export class NotFoundError extends AppError {
    constructor(resource = 'Resource', details) {
        super(`${resource} not found`, ErrorCode.NOT_FOUND, 404, true, details);
    }
}
export class ConflictError extends AppError {
    constructor(message, details) {
        super(message, ErrorCode.ALREADY_EXISTS, 409, true, details);
    }
}
export class NetworkError extends AppError {
    constructor(message = 'Network error occurred', details) {
        super(message, ErrorCode.NETWORK_ERROR, 0, true, details);
    }
}
export class TimeoutError extends AppError {
    constructor(message = 'Request timeout', details) {
        super(message, ErrorCode.TIMEOUT_ERROR, 408, true, details);
    }
}
export class RateLimitError extends AppError {
    constructor(message = 'Rate limit exceeded', details) {
        super(message, ErrorCode.RATE_LIMITED, 429, true, details);
    }
}
// Error handling utilities
export function isAppError(error) {
    return error instanceof AppError;
}
export function getErrorCode(error) {
    if (isAppError(error)) {
        return error.code;
    }
    return ErrorCode.UNKNOWN_ERROR;
}
export function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred';
}
export function getErrorDetails(error) {
    if (isAppError(error)) {
        return error.details;
    }
    return null;
}
// Error logging utility
export function logError(error, context) {
    const timestamp = new Date().toISOString();
    const errorMessage = getErrorMessage(error);
    const errorCode = getErrorCode(error);
    const details = getErrorDetails(error);
    const logData = {
        timestamp,
        context,
        code: errorCode,
        message: errorMessage,
        details,
        stack: error instanceof Error ? error.stack : undefined,
    };
    // In development, log to console
    if (process.env['NODE_ENV'] === 'development') {
        console.error('Error occurred:', logData);
    }
    // In production, you might want to send to an error reporting service
    // Example: Sentry.captureException(error, { extra: logData });
}
// Error boundary helper
export function handleError(error, context) {
    logError(error, context);
    if (isAppError(error)) {
        return error;
    }
    // Convert unknown errors to AppError
    const message = getErrorMessage(error);
    return new AppError(message, ErrorCode.UNKNOWN_ERROR, 500, false);
}
// Async error wrapper
export function withErrorHandling(fn, context) {
    return async (...args) => {
        try {
            return await fn(...args);
        }
        catch (error) {
            throw handleError(error, context);
        }
    };
}
// Retry utility with exponential backoff
export async function withRetry(fn, maxRetries = 3, baseDelay = 1000, maxDelay = 10000) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            // Don't retry on the last attempt
            if (attempt === maxRetries) {
                break;
            }
            // Don't retry certain types of errors
            if (isAppError(error) && !shouldRetry(error)) {
                break;
            }
            // Calculate delay with exponential backoff
            const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
function shouldRetry(error) {
    // Don't retry client errors (4xx) except for rate limiting
    if (error.statusCode >= 400 && error.statusCode < 500) {
        return error.code === ErrorCode.RATE_LIMITED;
    }
    // Retry server errors (5xx) and network errors
    return error.statusCode >= 500 || error.code === ErrorCode.NETWORK_ERROR;
}
//# sourceMappingURL=errors.js.map