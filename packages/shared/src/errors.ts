// Error handling utilities and custom error classes

export enum ErrorCode {
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMITED = 'RATE_LIMITED',
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
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
  constructor(message: string, field?: string, details?: any) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, true, { field, ...details });
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, ErrorCode.UNAUTHORIZED, 401, true, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', details?: any) {
    super(message, ErrorCode.FORBIDDEN, 403, true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', details?: any) {
    super(`${resource} not found`, ErrorCode.NOT_FOUND, 404, true, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorCode.ALREADY_EXISTS, 409, true, details);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred', details?: any) {
    super(message, ErrorCode.NETWORK_ERROR, 0, true, details);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout', details?: any) {
    super(message, ErrorCode.TIMEOUT_ERROR, 408, true, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, ErrorCode.RATE_LIMITED, 429, true, details);
  }
}

// Error handling utilities
export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

export function getErrorCode(error: unknown): ErrorCode {
  if (isAppError(error)) {
    return error.code;
  }
  return ErrorCode.UNKNOWN_ERROR;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

export function getErrorDetails(error: unknown): any {
  if (isAppError(error)) {
    return error.details;
  }
  return null;
}

// Error logging utility
export function logError(error: unknown, context?: string): void {
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
export function handleError(error: unknown, context?: string): AppError {
  logError(error, context);
  
  if (isAppError(error)) {
    return error;
  }
  
  // Convert unknown errors to AppError
  const message = getErrorMessage(error);
  return new AppError(message, ErrorCode.UNKNOWN_ERROR, 500, false);
}

// Async error wrapper
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error, context);
    }
  };
}

// Retry utility with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
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

function shouldRetry(error: AppError): boolean {
  // Don't retry client errors (4xx) except for rate limiting
  if (error.statusCode >= 400 && error.statusCode < 500) {
    return error.code === ErrorCode.RATE_LIMITED;
  }
  
  // Retry server errors (5xx) and network errors
  return error.statusCode >= 500 || error.code === ErrorCode.NETWORK_ERROR;
}
