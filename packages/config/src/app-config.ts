import { APP_NAME, APP_VERSION, DEFAULT_THEME, API_CONFIG } from "@boilerplate/shared";

export const APP_CONFIG = {
  name: APP_NAME,
  version: APP_VERSION,
  description: "Cross-platform application boilerplate",

  // API settings
  api: {
    timeout: API_CONFIG.DEFAULT_TIMEOUT,
    retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
    retryDelay: API_CONFIG.RETRY_DELAY,
  },

  // UI settings
  ui: {
    theme: DEFAULT_THEME,
    language: "en",
    showAdvancedControls: false,
    updateInterval: 1000,
  },

  // Platform-specific settings
  platform: {
    desktop: {
      windowSize: {
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
      },
      autoStart: false,
      minimizeToTray: true,
    },
    mobile: {
      keepScreenOn: false,
      backgroundMode: false,
      hapticFeedback: true,
    },
    web: {
      enablePWA: true,
      offlineSupport: true,
    },
  },

  // Feature flags
  features: {
    analytics: false,
    crashReporting: false,
    betaFeatures: false,
  },
} as const;
