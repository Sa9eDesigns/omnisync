// Core types for OmniSync

export interface AudioStreamConfig {
  sampleRate: number;
  channels: number;
  bitrate: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
}

export interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate" | "join" | "leave" | "error";
  payload: any;
  from?: string;
  to?: string;
  timestamp?: number;
}

export interface PeerConnectionConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: "mobile" | "desktop";
  platform: string;
  version: string;
}

export interface ConnectionState {
  status: "disconnected" | "connecting" | "connected" | "failed" | "closed";
  latency?: number;
  quality?: "poor" | "fair" | "good" | "excellent";
}

export interface AudioMetrics {
  inputLevel: number;
  outputLevel: number;
  packetsLost: number;
  jitter: number;
  roundTripTime: number;
}
