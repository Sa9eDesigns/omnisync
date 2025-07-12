import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { colors, typography, spacing, borderRadius } from "../utils/styling";
import { Button } from "./Button";
import { Modal, ModalContent, ModalHeader } from "./Modal";

interface Device {
  deviceId: string;
  label: string;
  kind: "audioinput" | "audiooutput";
}

interface DeviceSelectorProps {
  devices: Device[];
  selectedDeviceId?: string;
  onDeviceChange: (deviceId: string) => void;
  type: "input" | "output";
  style?: any;
  disabled?: boolean;
  placeholder?: string;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedDeviceId,
  onDeviceChange,
  type,
  style,
  disabled = false,
  placeholder,
}) => {
  const [showModal, setShowModal] = useState(false);

  const filteredDevices = devices.filter(device => 
    type === "input" ? device.kind === "audioinput" : device.kind === "audiooutput"
  );

  const selectedDevice = filteredDevices.find(device => device.deviceId === selectedDeviceId);
  const defaultPlaceholder = type === "input" 
    ? "Select microphone..." 
    : "Select speaker...";

  const handleDeviceSelect = (deviceId: string) => {
    onDeviceChange(deviceId);
    setShowModal(false);
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <Button
      variant={item.deviceId === selectedDeviceId ? "primary" : "outline"}
      size="md"
      onPress={() => handleDeviceSelect(item.deviceId)}
      style={styles.deviceButton}
      textStyle={styles.deviceButtonText}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceIcon}>
          {type === "input" ? "🎤" : "🔊"}
        </Text>
        <Text style={styles.deviceLabel} numberOfLines={2}>
          {item.label}
        </Text>
        {item.deviceId === selectedDeviceId && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
    </Button>
  );

  return (
    <View style={[styles.container, style]}>
      <Button
        variant="outline"
        size="md"
        onPress={() => setShowModal(true)}
        disabled={disabled}
        style={styles.triggerButton}
      >
        <View style={styles.triggerContent}>
          <Text style={styles.triggerIcon}>
            {type === "input" ? "🎤" : "🔊"}
          </Text>
          <Text style={styles.triggerText} numberOfLines={1}>
            {selectedDevice?.label || placeholder || defaultPlaceholder}
          </Text>
          <Text style={styles.chevron}>▼</Text>
        </View>
      </Button>

      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        position="bottom"
        size="lg"
      >
        <ModalHeader 
          title={`Select ${type === "input" ? "Microphone" : "Speaker"}`}
          onClose={() => setShowModal(false)} 
        />
        <ModalContent>
          {filteredDevices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No {type === "input" ? "microphones" : "speakers"} found
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredDevices}
              renderItem={renderDevice}
              keyExtractor={(item) => item.deviceId}
              style={styles.deviceList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </ModalContent>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  
  triggerButton: {
    width: "100%",
  },
  
  triggerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    flex: 1,
  },
  
  triggerIcon: {
    fontSize: 16,
  },
  
  triggerText: {
    flex: 1,
    textAlign: "left",
    fontSize: typography.fontSize.sm,
  },
  
  chevron: {
    fontSize: 12,
    color: colors.gray[500],
  },
  
  deviceList: {
    maxHeight: 300,
  },
  
  deviceButton: {
    marginBottom: spacing[2],
    width: "100%",
  },
  
  deviceButtonText: {
    textAlign: "left",
  },
  
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    flex: 1,
  },
  
  deviceIcon: {
    fontSize: 16,
  },
  
  deviceLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    textAlign: "left",
  },
  
  checkmark: {
    fontSize: 16,
    color: colors.primary[600],
  },
  
  emptyState: {
    padding: spacing[8],
    alignItems: "center",
  },
  
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    textAlign: "center",
  },
});
