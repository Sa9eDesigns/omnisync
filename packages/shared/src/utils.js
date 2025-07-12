/**
 * Generates a unique ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates a UUID v4
 */
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * Detects the current platform
 */
export function detectPlatform() {
    // Browser environment
    if (typeof globalThis !== "undefined" && 'navigator' in globalThis) {
        const userAgent = globalThis.navigator.userAgent.toLowerCase();
        if (userAgent.includes("android"))
            return "android";
        if (userAgent.includes("iphone") || userAgent.includes("ipad"))
            return "ios";
        if (userAgent.includes("mac"))
            return "macos";
        if (userAgent.includes("win"))
            return "windows";
        if (userAgent.includes("linux"))
            return "linux";
    }
    // Node.js environment
    if (typeof process !== "undefined" && process.platform) {
        return process.platform;
    }
    return "unknown";
}
/**
 * Creates device info object
 */
export function createDeviceInfo(name, type, version = "1.0.0") {
    return {
        id: generateId(),
        name,
        type,
        platform: detectPlatform(),
        version,
    };
}
/**
 * Formats a date to a readable string
 */
export function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
/**
 * Formats a date with time
 */
export function formatDateTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Truncates text to a specified length
 */
export function truncate(text, length) {
    if (text.length <= length)
        return text;
    return text.slice(0, length) + '...';
}
/**
 * Creates a successful API response
 */
export function createSuccessResponse(data, message) {
    return {
        success: true,
        data,
        message,
    };
}
/**
 * Creates an error API response
 */
export function createErrorResponse(error, message) {
    return {
        success: false,
        error,
        message,
    };
}
/**
 * Debounce function for performance optimization
 */
export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Throttle function for performance optimization
 */
export function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
//# sourceMappingURL=utils.js.map