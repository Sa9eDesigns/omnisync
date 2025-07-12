// Application constants
export const APP_NAME = "Cross-Platform Boilerplate";
export const APP_VERSION = "1.0.0";
// API configuration
export const API_CONFIG = {
    DEFAULT_TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};
// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
// Default theme
export const DEFAULT_THEME = {
    name: 'default',
    colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        background: '#FFFFFF',
        surface: '#F2F2F7',
        text: '#000000',
        textSecondary: '#8E8E93',
        border: '#C6C6C8',
        error: '#FF3B30',
        warning: '#FF9500',
        success: '#34C759',
    },
};
// Dark theme
export const DARK_THEME = {
    name: 'dark',
    colors: {
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        background: '#000000',
        surface: '#1C1C1E',
        text: '#FFFFFF',
        textSecondary: '#8E8E93',
        border: '#38383A',
        error: '#FF453A',
        warning: '#FF9F0A',
        success: '#30D158',
    },
};
// Storage keys
export const STORAGE_KEYS = {
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme',
    AUTH_TOKEN: 'auth_token',
    LAST_SYNC: 'last_sync',
};
// Error codes
export const ERROR_CODES = {
    NETWORK_ERROR: "NETWORK_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    SERVER_ERROR: "SERVER_ERROR",
};
// Environment types
export const ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
};
//# sourceMappingURL=constants.js.map