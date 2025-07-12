// Environment configuration for OmniSync

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  nodeEnv: string;
  port: number;
  host: string;
  apiUrl: string;
  wsUrl: string;
  logLevel: "debug" | "info" | "warn" | "error";
}

export const environment: EnvironmentConfig = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "localhost",
  apiUrl: process.env.API_URL || "http://localhost:3000/api",
  wsUrl: process.env.WS_URL || "ws://localhost:3001",
  logLevel: (process.env.LOG_LEVEL as EnvironmentConfig["logLevel"]) || "info",
};

export const getEnvironmentVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
};

export const isServer = typeof window === "undefined";
export const isBrowser = typeof window !== "undefined";

export default environment;
