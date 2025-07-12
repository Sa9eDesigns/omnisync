import {
  type AudioStreamConfig,
  type AudioMetrics,
  DEFAULT_AUDIO_CONFIG,
  calculateAudioQuality,
} from "@omnisync/shared";

export class AudioManager {
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private onMetricsCallback?: (metrics: AudioMetrics) => void;

  constructor(private config: AudioStreamConfig = DEFAULT_AUDIO_CONFIG) {}

  /**
   * Get local audio stream from microphone
   */
  async getLocalAudioStream(): Promise<MediaStream> {
    if (!this.localStream) {
      const constraints: MediaStreamConstraints = {
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels,
          noiseSuppression: this.config.noiseSuppression ?? true,
          echoCancellation: this.config.echoCancellation ?? true,
          autoGainControl: this.config.autoGainControl ?? true,
        },
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.setupAudioAnalysis(this.localStream);
    }

    return this.localStream;
  }

  /**
   * Set remote audio stream for playback
   */
  setRemoteAudioStream(stream: MediaStream): void {
    this.remoteStream = stream;
  }

  /**
   * Get available audio input devices
   */
  async getAudioInputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audioinput");
  }

  /**
   * Get available audio output devices
   */
  async getAudioOutputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audiooutput");
  }

  /**
   * Switch to a different audio input device
   */
  async switchAudioInputDevice(deviceId: string): Promise<void> {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    const constraints: MediaStreamConstraints = {
      audio: {
        deviceId: { exact: deviceId },
        sampleRate: this.config.sampleRate,
        channelCount: this.config.channels,
        noiseSuppression: this.config.noiseSuppression ?? true,
        echoCancellation: this.config.echoCancellation ?? true,
        autoGainControl: this.config.autoGainControl ?? true,
      },
    };

    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    this.setupAudioAnalysis(this.localStream);
  }

  /**
   * Mute/unmute local audio
   */
  setMuted(muted: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  /**
   * Get current audio input level
   */
  getInputLevel(): number {
    if (!this.analyser) return 0;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }

    return sum / (dataArray.length * 255); // Normalize to 0-1
  }

  /**
   * Set metrics callback
   */
  onMetrics(callback: (metrics: AudioMetrics) => void): void {
    this.onMetricsCallback = callback;
  }

  /**
   * Start monitoring audio metrics
   */
  startMetricsMonitoring(): void {
    const updateMetrics = () => {
      if (this.onMetricsCallback) {
        const metrics: AudioMetrics = {
          inputLevel: this.getInputLevel(),
          outputLevel: 0, // TODO: Implement output level detection
          packetsLost: 0, // TODO: Get from WebRTC stats
          jitter: 0, // TODO: Get from WebRTC stats
          roundTripTime: 0, // TODO: Get from WebRTC stats
        };

        this.onMetricsCallback(metrics);
      }

      requestAnimationFrame(updateMetrics);
    };

    updateMetrics();
  }

  /**
   * Apply audio effects/filters
   */
  applyAudioEffects(effects: {
    gain?: number;
    highpass?: number;
    lowpass?: number;
  }): void {
    if (!this.audioContext || !this.localStream) return;

    const source = this.audioContext.createMediaStreamSource(this.localStream);
    let currentNode: AudioNode = source;

    // Apply gain
    if (effects.gain !== undefined) {
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = effects.gain;
      currentNode.connect(gainNode);
      currentNode = gainNode;
    }

    // Apply high-pass filter
    if (effects.highpass !== undefined) {
      const highpassFilter = this.audioContext.createBiquadFilter();
      highpassFilter.type = "highpass";
      highpassFilter.frequency.value = effects.highpass;
      currentNode.connect(highpassFilter);
      currentNode = highpassFilter;
    }

    // Apply low-pass filter
    if (effects.lowpass !== undefined) {
      const lowpassFilter = this.audioContext.createBiquadFilter();
      lowpassFilter.type = "lowpass";
      lowpassFilter.frequency.value = effects.lowpass;
      currentNode.connect(lowpassFilter);
      currentNode = lowpassFilter;
    }

    // Connect to destination
    currentNode.connect(this.audioContext.destination);
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.remoteStream = null;
  }

  private setupAudioAnalysis(stream: MediaStream): void {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;

    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
  }
}
