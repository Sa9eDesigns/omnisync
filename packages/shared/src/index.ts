// Shared types and utilities for WebRTC audio streaming

export interface AudioStreamConfig {
  sampleRate: number;
  channels: number;
  bitrate: number;
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave';
  payload: any;
  from?: string;
  to?: string;
}

export const DEFAULT_AUDIO_CONFIG: AudioStreamConfig = {
  sampleRate: 48000,
  channels: 2,
  bitrate: 128000
};

export function createSignalingMessage(
  type: SignalingMessage['type'], 
  payload: any, 
  from?: string, 
  to?: string
): SignalingMessage {
  return { type, payload, from, to };
}
