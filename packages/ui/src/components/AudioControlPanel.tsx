import React, { useState } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { AudioControls } from "./AudioControls";
import { ConnectionStatus } from "./ConnectionStatus";
import { DeviceSelector } from "./DeviceSelector";
import { MetricsDisplay } from "./MetricsDisplay";
import { DialogComponent } from "./Dialog";
import { InputComponent } from "./Input";
import { useAudioStream } from "../hooks/useAudioStream";
import { useToast } from "./Toast";
import {
  type ConnectionState,
  type AudioMetrics,
  createDeviceInfo,
} from "@omnisync/shared";
import {
  Settings,
  Wifi,
  WifiOff,
  Mic,
  Speaker,
  Activity,
} from "lucide-react";

interface AudioControlPanelProps {
  className?: string;
  onStreamStart?: (stream: MediaStream) => void;
  onStreamStop?: () => void;
  connectionState?: ConnectionState;
  metrics?: AudioMetrics;
}

export const AudioControlPanel: React.FC<AudioControlPanelProps> = ({
  className,
  onStreamStart,
  onStreamStop,
  connectionState = { status: "disconnected" },
  metrics = {
    inputLevel: 0,
    outputLevel: 0,
    packetsLost: 0,
    jitter: 0,
    roundTripTime: 0,
  },
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [autoGainControl, setAutoGainControl] = useState(true);
  const [serverUrl, setServerUrl] = useState("ws://localhost:3001");

  const { addToast } = useToast();

  const {
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
    error,
  } = useAudioStream({
    onStreamStart: (stream) => {
      addToast({
        type: "success",
        title: "Audio stream started",
        description: "Microphone is now active",
      });
      onStreamStart?.(stream);
    },
    onStreamStop: () => {
      addToast({
        type: "info",
        title: "Audio stream stopped",
        description: "Microphone is now inactive",
      });
      onStreamStop?.();
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Audio stream error",
        description: error.message,
      });
    },
  });

  const handleStartStream = async () => {
    try {
      await startStream();
    } catch (err) {
      console.error("Failed to start stream:", err);
    }
  };

  const handleStopStream = () => {
    stopStream();
  };

  const handleDeviceChange = async (deviceId: string) => {
    try {
      await switchDevice(deviceId);
      addToast({
        type: "success",
        title: "Device switched",
        description: "Audio device changed successfully",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Device switch failed",
        description: "Failed to switch audio device",
      });
    }
  };

  return (
    <div className={cn("omnisync-component space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audio Control</h2>
          <p className="text-sm text-gray-600">
            Manage your audio streaming settings
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Settings className="h-4 w-4" />}
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </div>

      {/* Connection Status */}
      <ConnectionStatus connectionState={connectionState} />

      {/* Audio Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mic className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Audio Controls</h3>
        </div>
        
        <AudioControls
          isMuted={isMuted}
          volume={volume}
          inputLevel={inputLevel}
          onMuteToggle={toggleMute}
          onVolumeChange={setVolume}
          onStartStream={handleStartStream}
          onStopStream={handleStopStream}
          isStreaming={isStreaming}
          showAdvanced={true}
          noiseSuppression={noiseSuppression}
          echoCancellation={echoCancellation}
          autoGainControl={autoGainControl}
          onNoiseSuppressionChange={setNoiseSuppression}
          onEchoCancellationChange={setEchoCancellation}
          onAutoGainControlChange={setAutoGainControl}
        />
      </div>

      {/* Device Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Speaker className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Device Selection</h3>
        </div>
        
        <div className="space-y-4">
          <DeviceSelector
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onDeviceChange={handleDeviceChange}
            type="input"
            placeholder="Select microphone..."
          />
        </div>
      </div>

      {/* Metrics */}
      {connectionState.status === "connected" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          
          <MetricsDisplay metrics={metrics} />
        </div>
      )}

      {/* Settings Dialog */}
      <DialogComponent
        open={showSettings}
        onOpenChange={setShowSettings}
        title="Audio Settings"
        description="Configure your audio streaming preferences"
        size="lg"
      >
        <div className="space-y-6">
          {/* Server Configuration */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Server Configuration
            </h4>
            <InputComponent
              label="Signaling Server URL"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="ws://localhost:3001"
              description="WebSocket URL for the signaling server"
              fullWidth
            />
          </div>

          {/* Audio Quality Presets */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Audio Quality Presets
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" size="sm" fullWidth>
                Low Latency
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                Balanced
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                High Quality
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                addToast({
                  type: "success",
                  title: "Settings saved",
                  description: "Your audio settings have been updated",
                });
                setShowSettings(false);
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogComponent>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-red-600" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Audio Stream Error
              </h4>
              <p className="text-sm text-red-700 mt-1">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
