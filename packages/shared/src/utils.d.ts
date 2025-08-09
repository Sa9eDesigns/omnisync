import type { DeviceInfo, ApiResponse } from "./types";
/**
 * Generates a unique ID
 */
export declare function generateId(): string;
/**
 * Generates a UUID v4
 */
export declare function generateUUID(): string;
/**
 * Detects the current platform
 */
export declare function detectPlatform(): string;
/**
 * Creates device info object
 */
export declare function createDeviceInfo(name: string, type: "mobile" | "desktop" | "web", version?: string): DeviceInfo;
/**
 * Formats a date to a readable string
 */
export declare function formatDate(date: Date | string): string;
/**
 * Formats a date with time
 */
export declare function formatDateTime(date: Date | string): string;
/**
 * Capitalizes the first letter of a string
 */
export declare function capitalize(str: string): string;
/**
 * Truncates text to a specified length
 */
export declare function truncate(text: string, length: number): string;
/**
 * Creates a successful API response
 */
export declare function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T>;
/**
 * Creates an error API response
 */
export declare function createErrorResponse(error: string, message?: string): ApiResponse;
/**
 * Debounce function for performance optimization
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function for performance optimization
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=utils.d.ts.map