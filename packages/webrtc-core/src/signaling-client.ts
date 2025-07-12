import { io, Socket } from "socket.io-client";
import {
  type SignalingMessage,
  type DeviceInfo,
  createSignalingMessage,
  SIGNALING_SERVER,
} from "@omnisync/shared";

export class SignalingClient {
  private socket: Socket | null = null;
  private deviceInfo: DeviceInfo;
  private onMessageCallback?: (message: SignalingMessage) => void;
  private onConnectedCallback?: () => void;
  private onDisconnectedCallback?: () => void;
  private reconnectAttempts = 0;

  constructor(
    deviceInfo: DeviceInfo,
    private serverUrl: string = `http://${SIGNALING_SERVER.DEFAULT_HOST}:${SIGNALING_SERVER.DEFAULT_PORT}`
  ) {
    this.deviceInfo = deviceInfo;
  }

  /**
   * Connect to the signaling server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.serverUrl, {
        transports: ["websocket"],
        timeout: 10000,
      });

      this.socket.on("connect", () => {
        console.log("Connected to signaling server");
        this.reconnectAttempts = 0;
        this.onConnectedCallback?.();
        resolve();
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from signaling server:", reason);
        this.onDisconnectedCallback?.();
        this.handleReconnection();
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        reject(error);
      });

      this.socket.on("message", (data: SignalingMessage) => {
        this.onMessageCallback?.(data);
      });

      this.socket.on("error", (error) => {
        console.error("Signaling error:", error);
      });

      // Register device with server
      this.socket.emit("register", this.deviceInfo);
    });
  }

  /**
   * Send a signaling message
   */
  sendMessage(message: SignalingMessage): void {
    if (!this.socket || !this.socket.connected) {
      throw new Error("Not connected to signaling server");
    }

    this.socket.emit("message", message);
  }

  /**
   * Send an offer
   */
  sendOffer(offer: RTCSessionDescriptionInit, to: string): void {
    const message = createSignalingMessage("offer", offer, this.deviceInfo.id, to);
    this.sendMessage(message);
  }

  /**
   * Send an answer
   */
  sendAnswer(answer: RTCSessionDescriptionInit, to: string): void {
    const message = createSignalingMessage("answer", answer, this.deviceInfo.id, to);
    this.sendMessage(message);
  }

  /**
   * Send an ICE candidate
   */
  sendIceCandidate(candidate: RTCIceCandidateInit, to: string): void {
    const message = createSignalingMessage("ice-candidate", candidate, this.deviceInfo.id, to);
    this.sendMessage(message);
  }

  /**
   * Join a room
   */
  joinRoom(roomId: string): void {
    const message = createSignalingMessage("join", { roomId }, this.deviceInfo.id);
    this.sendMessage(message);
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string): void {
    const message = createSignalingMessage("leave", { roomId }, this.deviceInfo.id);
    this.sendMessage(message);
  }

  /**
   * Set message callback
   */
  onMessage(callback: (message: SignalingMessage) => void): void {
    this.onMessageCallback = callback;
  }

  /**
   * Set connected callback
   */
  onConnected(callback: () => void): void {
    this.onConnectedCallback = callback;
  }

  /**
   * Set disconnected callback
   */
  onDisconnected(callback: () => void): void {
    this.onDisconnectedCallback = callback;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Disconnect from the signaling server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Update device info
   */
  updateDeviceInfo(deviceInfo: Partial<DeviceInfo>): void {
    this.deviceInfo = { ...this.deviceInfo, ...deviceInfo };
    
    if (this.socket?.connected) {
      this.socket.emit("update-device", this.deviceInfo);
    }
  }

  private handleReconnection(): void {
    if (this.reconnectAttempts >= SIGNALING_SERVER.MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${SIGNALING_SERVER.MAX_RECONNECT_ATTEMPTS})`);

    setTimeout(() => {
      if (!this.socket?.connected) {
        this.connect().catch((error) => {
          console.error("Reconnection failed:", error);
        });
      }
    }, SIGNALING_SERVER.RECONNECT_INTERVAL);
  }
}
