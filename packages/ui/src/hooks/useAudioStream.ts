import { useState, useEffect, useCallback, useRef } from "react";
import { type AudioStreamConfig, DEFAULT_AUDIO_CONFIG } from "@omnisync/shared";

interface UseAudioStreamOptions {
  config?: AudioStreamConfig;
  onStreamStart?: (stream: MediaStream) => void;
  onStreamStop?: () => void;
  onError?: (error: Error) => void;
}

interface UseAudioStreamReturn {
  stream: MediaStream | null;
  isStreaming: boolean;
  isMuted: boolean;
  inputLevel: number;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  startStream: () => Promise<void>;
  stopStream: () => void;
  toggleMute: () => void;
  switchDevice: (deviceId: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
  error: Error | null;
}

export const useAudioStream = (options: UseAudioStreamOptions = {}): UseAudioStreamReturn => {
  const {
    config = DEFAULT_AUDIO_CONFIG,
    onStreamStart,
    onStreamStop,
    onError,
  } = options;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Monitor input level
  const monitorInputLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }

    const average = sum / dataArray.length;
    const normalizedLevel = average / 255;
    setInputLevel(normalizedLevel);

    animationFrameRef.current = requestAnimationFrame(monitorInputLevel);
  }, []);

  // Setup audio analysis
  const setupAudioAnalysis = useCallback((mediaStream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      source.connect(analyserRef.current);

      monitorInputLevel();
    } catch (err) {
      console.error("Failed to setup audio analysis:", err);
    }
  }, [monitorInputLevel]);

  // Cleanup audio analysis
  const cleanupAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setInputLevel(0);
  }, []);

  // Start audio stream
  const startStream = useCallback(async () => {
    try {
      setError(null);
      
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          sampleRate: config.sampleRate,
          channelCount: config.channels,
          noiseSuppression: config.noiseSuppression ?? true,
          echoCancellation: config.echoCancellation ?? true,
          autoGainControl: config.autoGainControl ?? true,
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setIsStreaming(true);
      setupAudioAnalysis(mediaStream);
      onStreamStart?.(mediaStream);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to start audio stream");
      setError(error);
      onError?.(error);
    }
  }, [config, selectedDeviceId, onStreamStart, onError, setupAudioAnalysis]);

  // Stop audio stream
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setIsStreaming(false);
    cleanupAudioAnalysis();
    onStreamStop?.();
  }, [stream, cleanupAudioAnalysis, onStreamStop]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [stream, isMuted]);

  // Switch audio device
  const switchDevice = useCallback(async (deviceId: string) => {
    const wasStreaming = isStreaming;
    
    if (wasStreaming) {
      stopStream();
    }
    
    setSelectedDeviceId(deviceId);
    
    if (wasStreaming) {
      // Small delay to ensure cleanup is complete
      setTimeout(() => {
        startStream();
      }, 100);
    }
  }, [isStreaming, stopStream, startStream]);

  // Refresh available devices
  const refreshDevices = useCallback(async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter(device => device.kind === "audioinput");
      setDevices(audioInputs);
      
      // Set default device if none selected
      if (!selectedDeviceId && audioInputs.length > 0) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err) {
      console.error("Failed to enumerate devices:", err);
    }
  }, [selectedDeviceId]);

  // Initialize devices on mount
  useEffect(() => {
    refreshDevices();
    
    // Listen for device changes
    const handleDeviceChange = () => {
      refreshDevices();
    };
    
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    };
  }, [refreshDevices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    stream,
    isStreaming,
    isMuted,
    inputLevel,
    devices,
    selectedDeviceId,
    startStream,
    stopStream,
    toggleMute,
    switchDevice,
    refreshDevices,
    error,
  };
};
