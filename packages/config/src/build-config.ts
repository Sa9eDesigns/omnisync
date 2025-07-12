// Build configuration for OmniSync

export interface BuildConfig {
  version: string;
  buildTime: string;
  gitCommit?: string;
  environment: "development" | "staging" | "production";
  features: {
    analytics: boolean;
    debugging: boolean;
    hotReload: boolean;
  };
}

export const buildConfig: BuildConfig = {
  version: process.env.npm_package_version || "1.0.0",
  buildTime: new Date().toISOString(),
  gitCommit: process.env.GIT_COMMIT || undefined,
  environment: (process.env.NODE_ENV as BuildConfig["environment"]) || "development",
  features: {
    analytics: process.env.NODE_ENV === "production",
    debugging: process.env.NODE_ENV !== "production",
    hotReload: process.env.NODE_ENV === "development",
  },
};

export default buildConfig;
