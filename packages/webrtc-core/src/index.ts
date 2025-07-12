// WebRTC abstraction layer and utilities

import { AudioStreamConfig, SignalingMessage } from '@webrtc-audio/shared';

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;

  constructor(private config: AudioStreamConfig) {}

  async initialize(): Promise<void> {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    console.log('WebRTC Manager initialized');
  }

  async getLocalAudioStream(): Promise<MediaStream> {
    if (!this.localStream) {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels,
          noiseSuppression: true,
          echoCancellation: true
        }
      });
    }
    return this.localStream;
  }

  cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }
}

export { AudioStreamConfig, SignalingMessage } from '@webrtc-audio/shared';
