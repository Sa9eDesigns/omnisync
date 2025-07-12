import React, { useState } from "react";
import { Popover } from "@base-ui-components/react/popover";
import { Slider } from "@base-ui-components/react/slider";
import { Switch } from "@base-ui-components/react/switch";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Square,
  Settings
} from "lucide-react";

interface AudioControlsProps {
  isMuted: boolean;
  volume: number;
  inputLevel?: number;
  onMuteToggle: (muted: boolean) => void;
  onVolumeChange: (volume: number) => void;
  onStartStream?: () => void;
  onStopStream?: () => void;
  isStreaming?: boolean;
  className?: string;
  showAdvanced?: boolean;
  // Advanced controls
  noiseSuppression?: boolean;
  echoCancellation?: boolean;
  autoGainControl?: boolean;
  onNoiseSuppressionChange?: (enabled: boolean) => void;
  onEchoCancellationChange?: (enabled: boolean) => void;
  onAutoGainControlChange?: (enabled: boolean) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isMuted,
  volume,
  inputLevel = 0,
  onMuteToggle,
  onVolumeChange,
  onStartStream,
  onStopStream,
  isStreaming = false,
  className,
  showAdvanced = false,
  noiseSuppression = true,
  echoCancellation = true,
  autoGainControl = true,
  onNoiseSuppressionChange,
  onEchoCancellationChange,
  onAutoGainControlChange,
}) => {
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className={cn("omnisync-component flex items-center gap-3", className)}>
      {/* Mute/Unmute Button */}
      <Button
        variant={isMuted ? "destructive" : "outline"}
        size="md"
        onClick={() => onMuteToggle(!isMuted)}
        leftIcon={isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        title={isMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isMuted ? "Muted" : "Live"}
      </Button>

      {/* Input Level Indicator */}
      {inputLevel > 0 && (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-100 rounded-full",
                inputLevel > 0.8 ? "bg-red-500" :
                inputLevel > 0.6 ? "bg-yellow-500" :
                "bg-green-500"
              )}
              style={{ width: `${inputLevel * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Volume Control */}
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button
            variant="ghost"
            size="md"
            leftIcon={<VolumeIcon className="h-4 w-4" />}
            title="Volume control"
          >
            {Math.round(volume * 100)}%
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup
              className={cn(
                "bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]",
                "animate-slide-in"
              )}
            >
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Volume</div>
                <Slider.Root
                  value={[volume * 100]}
                  onValueChange={(values) => onVolumeChange(values[0] / 100)}
                  min={0}
                  max={100}
                  step={1}
                  className="relative flex items-center w-full h-5"
                >
                  <Slider.Track className="relative bg-gray-200 rounded-full w-full h-2">
                    <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />
                </Slider.Root>
                <div className="text-xs text-gray-500 text-center">
                  {Math.round(volume * 100)}%
                </div>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      {/* Stream Control */}
      {(onStartStream || onStopStream) && (
        <Button
          variant={isStreaming ? "destructive" : "primary"}
          size="md"
          onClick={isStreaming ? onStopStream : onStartStream}
          leftIcon={
            isStreaming ?
              <Square className="h-4 w-4" /> :
              <Play className="h-4 w-4" />
          }
        >
          {isStreaming ? "Stop Stream" : "Start Stream"}
        </Button>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button
              variant="ghost"
              size="md"
              leftIcon={<Settings className="h-4 w-4" />}
              title="Audio settings"
            />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8}>
              <Popover.Popup
                className={cn(
                  "bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[250px]",
                  "animate-slide-in"
                )}
              >
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700">
                    Audio Processing
                  </div>

                  {/* Noise Suppression */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600">
                      Noise Suppression
                    </label>
                    <Switch.Root
                      checked={noiseSuppression}
                      onCheckedChange={onNoiseSuppressionChange}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:bg-blue-600"
                    >
                      <Switch.Thumb className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
                    </Switch.Root>
                  </div>

                  {/* Echo Cancellation */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600">
                      Echo Cancellation
                    </label>
                    <Switch.Root
                      checked={echoCancellation}
                      onCheckedChange={onEchoCancellationChange}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:bg-blue-600"
                    >
                      <Switch.Thumb className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
                    </Switch.Root>
                  </div>

                  {/* Auto Gain Control */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600">
                      Auto Gain Control
                    </label>
                    <Switch.Root
                      checked={autoGainControl}
                      onCheckedChange={onAutoGainControlChange}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:bg-blue-600"
                    >
                      <Switch.Thumb className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
                    </Switch.Root>
                  </div>
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </div>
  );
};
