import { AuthErrorCode, AuthError } from '../types';

// Error message mapping
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password. Please try again.',
  [AuthErrorCode.USER_NOT_FOUND]: 'No account found with this email address.',
  [AuthErrorCode.EMAIL_ALREADY_EXISTS]: 'An account with this email already exists.',
  [AuthErrorCode.WEAK_PASSWORD]: 'Password is too weak. Please choose a stronger password.',
  [AuthErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please sign in again.',
  [AuthErrorCode.TOKEN_INVALID]: 'Invalid authentication token. Please sign in again.',
  [AuthErrorCode.ACCOUNT_LOCKED]: 'Your account has been locked. Please contact support.',
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Please verify your email address before signing in.',
  [AuthErrorCode.TWO_FACTOR_REQUIRED]: 'Two-factor authentication is required.',
  [AuthErrorCode.RATE_LIMITED]: 'Too many attempts. Please try again later.',
  [AuthErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
  [AuthErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

// Create auth error with proper message
export function createAuthError(
  code: AuthErrorCode,
  customMessage?: string,
  details?: any
): AuthError {
  const message = customMessage || AUTH_ERROR_MESSAGES[code];
  return new AuthError(code, message, details);
}

// Handle API errors and convert to AuthError
export function handleAuthApiError(error: any): AuthError {
  // If it's already an AuthError, return it
  if (error instanceof AuthError) {
    return error;
  }

  // Handle network errors
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return createAuthError(AuthErrorCode.NETWORK_ERROR);
  }

  // Handle timeout errors
  if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
    return createAuthError(AuthErrorCode.NETWORK_ERROR, 'Request timed out. Please try again.');
  }

  // Handle HTTP status codes
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    
    switch (status) {
      case 400:
        return createAuthError(AuthErrorCode.INVALID_CREDENTIALS);
      case 401:
        return createAuthError(AuthErrorCode.TOKEN_INVALID);
      case 403:
        return createAuthError(AuthErrorCode.ACCOUNT_LOCKED);
      case 404:
        return createAuthError(AuthErrorCode.USER_NOT_FOUND);
      case 409:
        return createAuthError(AuthErrorCode.EMAIL_ALREADY_EXISTS);
      case 422:
        return createAuthError(AuthErrorCode.WEAK_PASSWORD);
      case 429:
        return createAuthError(AuthErrorCode.RATE_LIMITED);
      case 500:
      case 502:
      case 503:
        return createAuthError(AuthErrorCode.UNKNOWN_ERROR, 'Server error. Please try again later.');
      default:
        return createAuthError(AuthErrorCode.UNKNOWN_ERROR);
    }
  }

  // Handle specific error messages
  const message = error.message || error.toString();
  
  if (message.includes('email') && message.includes('exists')) {
    return createAuthError(AuthErrorCode.EMAIL_ALREADY_EXISTS);
  }
  
  if (message.includes('password') && message.includes('weak')) {
    return createAuthError(AuthErrorCode.WEAK_PASSWORD);
  }
  
  if (message.includes('not found')) {
    return createAuthError(AuthErrorCode.USER_NOT_FOUND);
  }
  
  if (message.includes('invalid') && (message.includes('credentials') || message.includes('password'))) {
    return createAuthError(AuthErrorCode.INVALID_CREDENTIALS);
  }
  
  if (message.includes('expired')) {
    return createAuthError(AuthErrorCode.TOKEN_EXPIRED);
  }
  
  if (message.includes('network') || message.includes('connection')) {
    return createAuthError(AuthErrorCode.NETWORK_ERROR);
  }

  // Default to unknown error
  return createAuthError(AuthErrorCode.UNKNOWN_ERROR, message);
}

// Get user-friendly error message
export function getAuthErrorMessage(error: any): string {
  if (error instanceof AuthError) {
    return error.message;
  }
  
  const authError = handleAuthApiError(error);
  return authError.message;
}

// Check if error is retryable
export function isRetryableAuthError(error: AuthError): boolean {
  const retryableCodes = [
    AuthErrorCode.NETWORK_ERROR,
    AuthErrorCode.UNKNOWN_ERROR,
  ];
  
  return retryableCodes.includes(error.code);
}

// Check if error requires re-authentication
export function requiresReauth(error: AuthError): boolean {
  const reauthCodes = [
    AuthErrorCode.TOKEN_EXPIRED,
    AuthErrorCode.TOKEN_INVALID,
  ];
  
  return reauthCodes.includes(error.code);
}

// Log auth errors (for debugging and monitoring)
export function logAuthError(error: AuthError, context?: string): void {
  const logData = {
    timestamp: new Date().toISOString(),
    context,
    code: error.code,
    message: error.message,
    details: error.details,
    stack: error.stack,
  };
  
  // In development, log to console
  if (process.env['NODE_ENV'] === 'development') {
    console.error('Auth Error:', logData);
  }
  
  // In production, you might want to send to an error reporting service
  // Example: Sentry.captureException(error, { extra: logData });
}

// Validation error helpers
export function createValidationError(field: string, message: string): AuthError {
  return createAuthError(
    AuthErrorCode.INVALID_CREDENTIALS,
    message,
    { field, type: 'validation' }
  );
}

// Rate limiting helpers
export function createRateLimitError(retryAfter?: number): AuthError {
  const message = retryAfter 
    ? `Too many attempts. Please try again in ${retryAfter} seconds.`
    : 'Too many attempts. Please try again later.';
    
  return createAuthError(AuthErrorCode.RATE_LIMITED, message, { retryAfter });
}

// Network error helpers
export function createNetworkError(details?: any): AuthError {
  return createAuthError(
    AuthErrorCode.NETWORK_ERROR,
    'Network error. Please check your connection and try again.',
    details
  );
}
