import {
  type PeerConnectionConfig,
  type ConnectionState,
  DEFAULT_PEER_CONFIG,
} from "@omnisync/shared";

export class PeerConnectionManager {
  private peerConnection: RTCPeerConnection | null = null;
  private connectionState: ConnectionState = { status: "disconnected" };
  private onStateChangeCallback?: (state: ConnectionState) => void;

  constructor(private config: PeerConnectionConfig = DEFAULT_PEER_CONFIG) {}

  /**
   * Initialize the peer connection
   */
  async initialize(): Promise<void> {
    this.peerConnection = new RTCPeerConnection(this.config);
    this.setupEventHandlers();
    this.updateConnectionState({ status: "connecting" });
  }

  /**
   * Add a local stream to the peer connection
   */
  addLocalStream(stream: MediaStream): void {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    stream.getTracks().forEach((track) => {
      this.peerConnection!.addTrack(track, stream);
    });
  }

  /**
   * Create an offer
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  /**
   * Create an answer
   */
  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  /**
   * Set remote description
   */
  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    await this.peerConnection.setRemoteDescription(description);
  }

  /**
   * Add ICE candidate
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    await this.peerConnection.addIceCandidate(candidate);
  }

  /**
   * Get connection statistics
   */
  async getStats(): Promise<RTCStatsReport> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    return await this.peerConnection.getStats();
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Set connection state change callback
   */
  onStateChange(callback: (state: ConnectionState) => void): void {
    this.onStateChangeCallback = callback;
  }

  /**
   * Close the peer connection
   */
  close(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
      this.updateConnectionState({ status: "closed" });
    }
  }

  private setupEventHandlers(): void {
    if (!this.peerConnection) return;

    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection!.connectionState;
      switch (state) {
        case "connected":
          this.updateConnectionState({ status: "connected" });
          break;
        case "disconnected":
          this.updateConnectionState({ status: "disconnected" });
          break;
        case "failed":
          this.updateConnectionState({ status: "failed" });
          break;
        case "closed":
          this.updateConnectionState({ status: "closed" });
          break;
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", this.peerConnection!.iceConnectionState);
    };

    this.peerConnection.onicegatheringstatechange = () => {
      console.log("ICE gathering state:", this.peerConnection!.iceGatheringState);
    };
  }

  private updateConnectionState(newState: Partial<ConnectionState>): void {
    this.connectionState = { ...this.connectionState, ...newState };
    this.onStateChangeCallback?.(this.connectionState);
  }
}
