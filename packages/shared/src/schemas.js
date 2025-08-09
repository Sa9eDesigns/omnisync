import { z } from "zod";
// User schema
export const UserSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// API response schema
export const ApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
});
// Pagination schema
export const PaginationSchema = z.object({
    page: z.number().positive(),
    limit: z.number().positive().max(100),
    total: z.number().nonnegative(),
    totalPages: z.number().nonnegative(),
});
// Paginated response schema
export const PaginatedResponseSchema = ApiResponseSchema.extend({
    data: z.array(z.any()).optional(),
    pagination: PaginationSchema,
});
// App config schema
export const AppConfigSchema = z.object({
    apiUrl: z.string().url(),
    environment: z.enum(['development', 'staging', 'production']),
    features: z.record(z.boolean()),
    version: z.string(),
});
// Device info schema
export const DeviceInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["mobile", "desktop", "web"]),
    platform: z.string(),
    version: z.string(),
});
// Theme schema
export const ThemeSchema = z.object({
    name: z.string(),
    colors: z.object({
        primary: z.string(),
        secondary: z.string(),
        background: z.string(),
        surface: z.string(),
        text: z.string(),
        textSecondary: z.string(),
        border: z.string(),
        error: z.string(),
        warning: z.string(),
        success: z.string(),
    }),
});
// Log entry schema
export const LogEntrySchema = z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']),
    message: z.string(),
    timestamp: z.number(),
    context: z.record(z.any()).optional(),
});
//# sourceMappingURL=schemas.js.map