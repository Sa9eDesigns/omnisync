import { useState, useEffect, useCallback, useRef } from "react";
import {
  type ConnectionState,
  type AudioMetrics,
  type DeviceInfo,
  calculateAudioQuality,
} from "@omnisync/shared";

interface UseWebRTCOptions {
  deviceInfo: DeviceInfo;
  signalingServerUrl?: string;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: ConnectionState) => void;
  onError?: (error: Error) => void;
}

interface UseWebRTCReturn {
  connectionState: ConnectionState;
  metrics: AudioMetrics;
  isConnected: boolean;
  connect: (localStream: MediaStream) => Promise<void>;
  disconnect: () => void;
  sendOffer: () => Promise<void>;
  sendAnswer: (offer: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  error: Error | null;
}

export const useWebRTC = (options: UseWebRTCOptions): UseWebRTCReturn => {
  const {
    deviceInfo,
    signalingServerUrl,
    onRemoteStream,
    onConnectionStateChange,
    onError,
  } = options;

  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: "disconnected",
  });
  const [metrics, setMetrics] = useState<AudioMetrics>({
    inputLevel: 0,
    outputLevel: 0,
    packetsLost: 0,
    jitter: 0,
    roundTripTime: 0,
  });
  const [error, setError] = useState<Error | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const metricsIntervalRef = useRef<NodeJS.Timeout>();

  const isConnected = connectionState.status === "connected";

  // Update connection state
  const updateConnectionState = useCallback((newState: Partial<ConnectionState>) => {
    setConnectionState(prev => {
      const updated = { ...prev, ...newState };
      onConnectionStateChange?.(updated);
      return updated;
    });
  }, [onConnectionStateChange]);

  // Setup peer connection
  const setupPeerConnection = useCallback(() => {
    const config: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(config);

    // Connection state changes
    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case "connecting":
          updateConnectionState({ status: "connecting" });
          break;
        case "connected":
          updateConnectionState({ status: "connected" });
          startMetricsCollection();
          break;
        case "disconnected":
          updateConnectionState({ status: "disconnected" });
          stopMetricsCollection();
          break;
        case "failed":
          updateConnectionState({ status: "failed" });
          stopMetricsCollection();
          break;
        case "closed":
          updateConnectionState({ status: "closed" });
          stopMetricsCollection();
          break;
      }
    };

    // ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

    // Remote stream
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      onRemoteStream?.(remoteStream);
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate through signaling
        console.log("New ICE candidate:", event.candidate);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [updateConnectionState, onRemoteStream]);

  // Start metrics collection
  const startMetricsCollection = useCallback(() => {
    if (!peerConnectionRef.current) return;

    const collectMetrics = async () => {
      try {
        const stats = await peerConnectionRef.current!.getStats();
        let packetsLost = 0;
        let jitter = 0;
        let roundTripTime = 0;

        stats.forEach((report) => {
          if (report.type === "inbound-rtp" && report.mediaType === "audio") {
            packetsLost = report.packetsLost || 0;
            jitter = report.jitter || 0;
          }
          if (report.type === "candidate-pair" && report.state === "succeeded") {
            roundTripTime = report.currentRoundTripTime * 1000 || 0; // Convert to ms
          }
        });

        const quality = calculateAudioQuality(packetsLost, jitter, roundTripTime);

        setMetrics(prev => ({
          ...prev,
          packetsLost,
          jitter,
          roundTripTime,
        }));

        updateConnectionState({
          latency: roundTripTime,
          quality,
        });
      } catch (err) {
        console.error("Failed to collect metrics:", err);
      }
    };

    // Collect metrics every second
    metricsIntervalRef.current = setInterval(collectMetrics, 1000);
    collectMetrics(); // Initial collection
  }, [updateConnectionState]);

  // Stop metrics collection
  const stopMetricsCollection = useCallback(() => {
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = undefined;
    }
  }, []);

  // Connect with local stream
  const connect = useCallback(async (localStream: MediaStream) => {
    try {
      setError(null);
      localStreamRef.current = localStream;

      const pc = setupPeerConnection();
      
      // Add local stream tracks
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      updateConnectionState({ status: "connecting" });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to connect");
      setError(error);
      onError?.(error);
    }
  }, [setupPeerConnection, updateConnectionState, onError]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    stopMetricsCollection();
    updateConnectionState({ status: "disconnected" });
  }, [stopMetricsCollection, updateConnectionState]);

  // Send offer
  const sendOffer = useCallback(async (): Promise<void> => {
    if (!peerConnectionRef.current) {
      throw new Error("Peer connection not established");
    }

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    // Send offer through signaling server
    console.log("Created offer:", offer);
  }, []);

  // Send answer
  const sendAnswer = useCallback(async (offer: RTCSessionDescriptionInit): Promise<void> => {
    if (!peerConnectionRef.current) {
      throw new Error("Peer connection not established");
    }

    await peerConnectionRef.current.setRemoteDescription(offer);
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    // Send answer through signaling server
    console.log("Created answer:", answer);
  }, []);

  // Add ICE candidate
  const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) {
      throw new Error("Peer connection not established");
    }

    await peerConnectionRef.current.addIceCandidate(candidate);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    metrics,
    isConnected,
    connect,
    disconnect,
    sendOffer,
    sendAnswer,
    addIceCandidate,
    error,
  };
};
