import { DEFAULT_AUDIO_CONFIG, SIGNALING_SERVER } from "@omnisync/shared";

export const APP_CONFIG = {
  name: "OmniSync",
  version: "1.0.0",
  description: "Real-time P2P audio streaming system",
  
  // Audio settings
  audio: {
    default: DEFAULT_AUDIO_CONFIG,
    presets: {
      highQuality: {
        sampleRate: 48000,
        channels: 2,
        bitrate: 320000,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
      lowLatency: {
        sampleRate: 44100,
        channels: 1,
        bitrate: 64000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      balanced: {
        sampleRate: 48000,
        channels: 2,
        bitrate: 128000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    },
  },

  // Network settings
  network: {
    signaling: {
      host: SIGNALING_SERVER.DEFAULT_HOST,
      port: SIGNALING_SERVER.DEFAULT_PORT,
      reconnectInterval: SIGNALING_SERVER.RECONNECT_INTERVAL,
      maxReconnectAttempts: SIGNALING_SERVER.MAX_RECONNECT_ATTEMPTS,
    },
    stun: [
      "stun:stun.l.google.com:19302",
      "stun:stun1.l.google.com:19302",
      "stun:stun2.l.google.com:19302",
    ],
    turn: [], // Add TURN servers if needed
  },

  // UI settings
  ui: {
    theme: "light",
    language: "en",
    showAdvancedControls: false,
    metricsUpdateInterval: 1000,
  },

  // Platform-specific settings
  platform: {
    desktop: {
      windowSize: {
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
      },
      autoStart: false,
      minimizeToTray: true,
    },
    mobile: {
      keepScreenOn: true,
      backgroundMode: false,
      hapticFeedback: true,
    },
  },
} as const;
