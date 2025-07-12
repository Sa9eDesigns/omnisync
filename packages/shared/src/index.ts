// Shared types and utilities for WebRTC audio streaming

// Re-export everything from modular files
export * from "./types";
export * from "./constants";
export * from "./utils";
export * from "./schemas";

// Legacy exports for backward compatibility
export type { AudioStreamConfig, SignalingMessage } from "./types";
export { DEFAULT_AUDIO_CONFIG } from "./constants";
export { createSignalingMessage } from "./utils";
