import { z } from "zod";
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    avatar?: string | undefined;
}, {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    avatar?: string | undefined;
}>;
export declare const ApiResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    error?: string | undefined;
    message?: string | undefined;
    data?: any;
}, {
    success: boolean;
    error?: string | undefined;
    message?: string | undefined;
    data?: any;
}>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodNumber;
    limit: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}>;
export declare const PaginatedResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
} & {
    data: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string | undefined;
    message?: string | undefined;
    data?: any[] | undefined;
}, {
    success: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string | undefined;
    message?: string | undefined;
    data?: any[] | undefined;
}>;
export declare const AppConfigSchema: z.ZodObject<{
    apiUrl: z.ZodString;
    environment: z.ZodEnum<["development", "staging", "production"]>;
    features: z.ZodRecord<z.ZodString, z.ZodBoolean>;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    apiUrl: string;
    environment: "development" | "staging" | "production";
    features: Record<string, boolean>;
    version: string;
}, {
    apiUrl: string;
    environment: "development" | "staging" | "production";
    features: Record<string, boolean>;
    version: string;
}>;
export declare const DeviceInfoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["mobile", "desktop", "web"]>;
    platform: z.ZodString;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    type: "mobile" | "desktop" | "web";
    version: string;
    platform: string;
}, {
    id: string;
    name: string;
    type: "mobile" | "desktop" | "web";
    version: string;
    platform: string;
}>;
export declare const ThemeSchema: z.ZodObject<{
    name: z.ZodString;
    colors: z.ZodObject<{
        primary: z.ZodString;
        secondary: z.ZodString;
        background: z.ZodString;
        surface: z.ZodString;
        text: z.ZodString;
        textSecondary: z.ZodString;
        border: z.ZodString;
        error: z.ZodString;
        warning: z.ZodString;
        success: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        error: string;
        success: string;
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        warning: string;
    }, {
        error: string;
        success: string;
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        warning: string;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    colors: {
        error: string;
        success: string;
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        warning: string;
    };
}, {
    name: string;
    colors: {
        error: string;
        success: string;
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        warning: string;
    };
}>;
export declare const LogEntrySchema: z.ZodObject<{
    level: z.ZodEnum<["debug", "info", "warn", "error"]>;
    message: z.ZodString;
    timestamp: z.ZodNumber;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    level: "debug" | "info" | "warn" | "error";
    timestamp: number;
    context?: Record<string, any> | undefined;
}, {
    message: string;
    level: "debug" | "info" | "warn" | "error";
    timestamp: number;
    context?: Record<string, any> | undefined;
}>;
export type UserType = z.infer<typeof UserSchema>;
export type ApiResponseType = z.infer<typeof ApiResponseSchema>;
export type PaginationType = z.infer<typeof PaginationSchema>;
export type PaginatedResponseType = z.infer<typeof PaginatedResponseSchema>;
export type AppConfigType = z.infer<typeof AppConfigSchema>;
export type DeviceInfoType = z.infer<typeof DeviceInfoSchema>;
export type ThemeType = z.infer<typeof ThemeSchema>;
export type LogEntryType = z.infer<typeof LogEntrySchema>;
//# sourceMappingURL=schemas.d.ts.map