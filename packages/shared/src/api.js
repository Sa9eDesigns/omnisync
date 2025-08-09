// API response utilities and types
// Response builders
export function createSuccessResponse(data, message) {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    };
}
export function createErrorResponse(error, code, details) {
    return {
        success: false,
        error,
        code,
        timestamp: new Date().toISOString(),
        ...(details && { details }),
    };
}
export function createPaginatedResponse(data, pagination, message) {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
        pagination: {
            ...pagination,
            totalPages,
            hasNext: pagination.page < totalPages,
            hasPrev: pagination.page > 1,
        },
    };
}
// HTTP status codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
};
// Error handling utilities
export function isApiError(error) {
    return error && typeof error.code === 'string' && typeof error.message === 'string';
}
export function getErrorMessage(error) {
    if (isApiError(error)) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred';
}
// Validation utilities
export function validateApiResponse(response) {
    if (!response || typeof response !== 'object') {
        throw new Error('Invalid API response format');
    }
    if (typeof response.success !== 'boolean') {
        throw new Error('API response must include success field');
    }
    return response;
}
//# sourceMappingURL=api.js.map