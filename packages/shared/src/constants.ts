import type { AudioStreamConfig, PeerConnectionConfig } from "./types";

// Default audio configuration
export const DEFAULT_AUDIO_CONFIG: AudioStreamConfig = {
  sampleRate: 48000,
  channels: 2,
  bitrate: 128000,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

// High quality audio configuration
export const HIGH_QUALITY_AUDIO_CONFIG: AudioStreamConfig = {
  sampleRate: 48000,
  channels: 2,
  bitrate: 320000,
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
};

// Low latency audio configuration
export const LOW_LATENCY_AUDIO_CONFIG: AudioStreamConfig = {
  sampleRate: 44100,
  channels: 1,
  bitrate: 64000,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

// Default STUN/TURN servers
export const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

// Default peer connection configuration
export const DEFAULT_PEER_CONFIG: PeerConnectionConfig = {
  iceServers: DEFAULT_ICE_SERVERS,
  iceCandidatePoolSize: 10,
};

// Signaling server configuration
export const SIGNALING_SERVER = {
  DEFAULT_PORT: 3001,
  DEFAULT_HOST: "localhost",
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 10,
};

// Audio processing constants
export const AUDIO_PROCESSING = {
  VAD_THRESHOLD: 0.01,
  SILENCE_TIMEOUT: 2000,
  BUFFER_SIZE: 4096,
  MAX_LATENCY: 100, // milliseconds
};

// Error codes
export const ERROR_CODES = {
  MEDIA_ACCESS_DENIED: "MEDIA_ACCESS_DENIED",
  PEER_CONNECTION_FAILED: "PEER_CONNECTION_FAILED",
  SIGNALING_CONNECTION_FAILED: "SIGNALING_CONNECTION_FAILED",
  AUDIO_DEVICE_NOT_FOUND: "AUDIO_DEVICE_NOT_FOUND",
  VIRTUAL_DEVICE_SETUP_FAILED: "VIRTUAL_DEVICE_SETUP_FAILED",
} as const;
