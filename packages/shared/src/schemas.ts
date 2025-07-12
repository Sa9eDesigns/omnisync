import { z } from "zod";

// Audio configuration schema
export const AudioStreamConfigSchema = z.object({
  sampleRate: z.number().positive(),
  channels: z.number().positive().int(),
  bitrate: z.number().positive(),
  echoCancellation: z.boolean().optional(),
  noiseSuppression: z.boolean().optional(),
  autoGainControl: z.boolean().optional(),
});

// Signaling message schema
export const SignalingMessageSchema = z.object({
  type: z.enum(["offer", "answer", "ice-candidate", "join", "leave", "error"]),
  payload: z.any(),
  from: z.string().optional(),
  to: z.string().optional(),
  timestamp: z.number().optional(),
});

// Device info schema
export const DeviceInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["mobile", "desktop"]),
  platform: z.string(),
  version: z.string(),
});

// Connection state schema
export const ConnectionStateSchema = z.object({
  status: z.enum(["disconnected", "connecting", "connected", "failed", "closed"]),
  latency: z.number().optional(),
  quality: z.enum(["poor", "fair", "good", "excellent"]).optional(),
});

// Audio metrics schema
export const AudioMetricsSchema = z.object({
  inputLevel: z.number().min(0).max(1),
  outputLevel: z.number().min(0).max(1),
  packetsLost: z.number().nonnegative(),
  jitter: z.number().nonnegative(),
  roundTripTime: z.number().nonnegative(),
});

// Peer connection config schema
export const PeerConnectionConfigSchema = z.object({
  iceServers: z.array(
    z.object({
      urls: z.union([z.string(), z.array(z.string())]),
      username: z.string().optional(),
      credential: z.string().optional(),
    })
  ),
  iceCandidatePoolSize: z.number().optional(),
});

// Export type inference helpers
export type AudioStreamConfigType = z.infer<typeof AudioStreamConfigSchema>;
export type SignalingMessageType = z.infer<typeof SignalingMessageSchema>;
export type DeviceInfoType = z.infer<typeof DeviceInfoSchema>;
export type ConnectionStateType = z.infer<typeof ConnectionStateSchema>;
export type AudioMetricsType = z.infer<typeof AudioMetricsSchema>;
export type PeerConnectionConfigType = z.infer<typeof PeerConnectionConfigSchema>;
