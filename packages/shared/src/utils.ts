import type { SignalingMessage, DeviceInfo } from "./types";

/**
 * Creates a signaling message with timestamp
 */
export function createSignalingMessage(
  type: SignalingMessage["type"],
  payload: any,
  from?: string,
  to?: string
): SignalingMessage {
  return {
    type,
    payload,
    from: from || "",
    to: to || "",
    timestamp: Date.now(),
  };
}

/**
 * Generates a unique device ID
 */
export function generateDeviceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Detects the current platform
 */
export function detectPlatform(): string {
  if (typeof navigator !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("android")) return "android";
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "ios";
    if (userAgent.includes("mac")) return "macos";
    if (userAgent.includes("win")) return "windows";
    if (userAgent.includes("linux")) return "linux";
  }
  
  // Node.js environment
  if (typeof process !== "undefined") {
    return process.platform;
  }
  
  return "unknown";
}

/**
 * Creates device info object
 */
export function createDeviceInfo(
  name: string,
  type: "mobile" | "desktop",
  version: string = "1.0.0"
): DeviceInfo {
  return {
    id: generateDeviceId(),
    name,
    type,
    platform: detectPlatform(),
    version,
  };
}

/**
 * Calculates audio quality based on metrics
 */
export function calculateAudioQuality(
  packetsLost: number,
  jitter: number,
  roundTripTime: number
): "poor" | "fair" | "good" | "excellent" {
  if (packetsLost > 5 || jitter > 50 || roundTripTime > 200) {
    return "poor";
  }
  if (packetsLost > 2 || jitter > 30 || roundTripTime > 100) {
    return "fair";
  }
  if (packetsLost > 0 || jitter > 15 || roundTripTime > 50) {
    return "good";
  }
  return "excellent";
}

/**
 * Formats latency for display
 */
export function formatLatency(latency: number): string {
  if (latency < 1000) {
    return `${Math.round(latency)}ms`;
  }
  return `${(latency / 1000).toFixed(1)}s`;
}

/**
 * Validates audio stream configuration
 */
export function validateAudioConfig(config: any): boolean {
  return (
    typeof config === "object" &&
    typeof config.sampleRate === "number" &&
    typeof config.channels === "number" &&
    typeof config.bitrate === "number" &&
    config.sampleRate > 0 &&
    config.channels > 0 &&
    config.bitrate > 0
  );
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
