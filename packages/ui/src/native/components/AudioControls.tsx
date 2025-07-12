import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../utils/styling";
import { Button } from "./Button";
import { Modal, ModalContent, ModalHeader } from "./Modal";

interface AudioControlsProps {
  isMuted: boolean;
  volume: number;
  inputLevel?: number;
  onMuteToggle: (muted: boolean) => void;
  onVolumeChange: (volume: number) => void;
  onStartStream?: () => void;
  onStopStream?: () => void;
  isStreaming?: boolean;
  style?: any;
  showAdvanced?: boolean;
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
  style,
  showAdvanced = false,
  noiseSuppression = true,
  echoCancellation = true,
  autoGainControl = true,
  onNoiseSuppressionChange,
  onEchoCancellationChange,
  onAutoGainControlChange,
}) => {
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {/* Mute/Unmute Button */}
      <Button
        variant={isMuted ? "destructive" : "outline"}
        size="md"
        onPress={() => onMuteToggle(!isMuted)}
      >
        {isMuted ? "🔇 Muted" : "🎤 Live"}
      </Button>

      {/* Input Level Indicator */}
      {inputLevel > 0 && (
        <View style={styles.levelContainer}>
          <View style={styles.levelTrack}>
            <View
              style={[
                styles.levelFill,
                {
                  width: `${inputLevel * 100}%`,
                  backgroundColor:
                    inputLevel > 0.8 ? colors.error[500] :
                    inputLevel > 0.6 ? colors.warning[500] :
                    colors.success[500],
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Volume Control */}
      <Button
        variant="ghost"
        size="md"
        onPress={() => setShowVolumeModal(true)}
      >
        🔉 {Math.round(volume * 100)}%
      </Button>

      {/* Stream Control */}
      {(onStartStream || onStopStream) && (
        <Button
          variant={isStreaming ? "destructive" : "primary"}
          size="md"
          onPress={isStreaming ? onStopStream : onStartStream}
        >
          {isStreaming ? "⏹ Stop" : "▶ Start"}
        </Button>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <Button
          variant="ghost"
          size="md"
          onPress={() => setShowAdvancedModal(true)}
        >
          ⚙️
        </Button>
      )}

      {/* Volume Modal */}
      <Modal
        visible={showVolumeModal}
        onClose={() => setShowVolumeModal(false)}
        position="center"
        size="sm"
      >
        <ModalHeader 
          title="Volume Control" 
          onClose={() => setShowVolumeModal(false)} 
        />
        <ModalContent>
          <View style={styles.volumeControl}>
            <Text style={styles.volumeLabel}>Volume: {Math.round(volume * 100)}%</Text>
            {/* Note: In a real implementation, you'd use a slider component */}
            <View style={styles.volumeButtons}>
              <Button
                variant="outline"
                size="sm"
                onPress={() => onVolumeChange(Math.max(0, volume - 0.1))}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => onVolumeChange(Math.min(1, volume + 0.1))}
              >
                +
              </Button>
            </View>
          </View>
        </ModalContent>
      </Modal>

      {/* Advanced Settings Modal */}
      <Modal
        visible={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
        position="center"
        size="md"
      >
        <ModalHeader 
          title="Audio Processing" 
          onClose={() => setShowAdvancedModal(false)} 
        />
        <ModalContent>
          <View style={styles.advancedSettings}>
            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Noise Suppression</Text>
              <Button
                variant={noiseSuppression ? "primary" : "outline"}
                size="sm"
                onPress={() => onNoiseSuppressionChange?.(!noiseSuppression)}
              >
                {noiseSuppression ? "On" : "Off"}
              </Button>
            </View>
            
            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Echo Cancellation</Text>
              <Button
                variant={echoCancellation ? "primary" : "outline"}
                size="sm"
                onPress={() => onEchoCancellationChange?.(!echoCancellation)}
              >
                {echoCancellation ? "On" : "Off"}
              </Button>
            </View>
            
            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Auto Gain Control</Text>
              <Button
                variant={autoGainControl ? "primary" : "outline"}
                size="sm"
                onPress={() => onAutoGainControlChange?.(!autoGainControl)}
              >
                {autoGainControl ? "On" : "Off"}
              </Button>
            </View>
          </View>
        </ModalContent>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    flexWrap: "wrap",
  },
  
  levelContainer: {
    flex: 1,
    minWidth: 60,
  },
  
  levelTrack: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  
  levelFill: {
    height: "100%",
    borderRadius: 4,
  },
  
  volumeControl: {
    alignItems: "center",
    gap: spacing[4],
  },
  
  volumeLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  
  volumeButtons: {
    flexDirection: "row",
    gap: spacing[2],
  },
  
  advancedSettings: {
    gap: spacing[4],
  },
  
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  settingLabel: {
    fontSize: 16,
    color: colors.gray[700],
  },
});
