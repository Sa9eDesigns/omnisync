import type { Theme } from "./types";
export declare const APP_NAME = "Cross-Platform Boilerplate";
export declare const APP_VERSION = "1.0.0";
export declare const API_CONFIG: {
    DEFAULT_TIMEOUT: number;
    RETRY_ATTEMPTS: number;
    RETRY_DELAY: number;
};
export declare const PAGINATION: {
    DEFAULT_PAGE: number;
    DEFAULT_LIMIT: number;
    MAX_LIMIT: number;
};
export declare const DEFAULT_THEME: Theme;
export declare const DARK_THEME: Theme;
export declare const STORAGE_KEYS: {
    readonly USER_PREFERENCES: "user_preferences";
    readonly THEME: "theme";
    readonly AUTH_TOKEN: "auth_token";
    readonly LAST_SYNC: "last_sync";
};
export declare const ERROR_CODES: {
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly SERVER_ERROR: "SERVER_ERROR";
};
export declare const ENVIRONMENTS: {
    readonly DEVELOPMENT: "development";
    readonly STAGING: "staging";
    readonly PRODUCTION: "production";
};
//# sourceMappingURL=constants.d.ts.map