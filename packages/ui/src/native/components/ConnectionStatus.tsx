import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { type ConnectionState, formatLatency } from "@omnisync/shared";
import { colors, typography, spacing, borderRadius } from "../utils/styling";
import { StatusBadge } from "./Badge";

interface ConnectionStatusProps {
  connectionState: ConnectionState;
  showDetails?: boolean;
  style?: any;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectionState,
  showDetails = true,
  style,
}) => {
  const getStatusConfig = (status: ConnectionState["status"]) => {
    switch (status) {
      case "connected":
        return {
          color: colors.success[600],
          bgColor: colors.success[50],
          borderColor: colors.success[200],
          label: "Connected",
        };
      case "connecting":
        return {
          color: colors.warning[600],
          bgColor: colors.warning[50],
          borderColor: colors.warning[200],
          label: "Connecting",
        };
      case "disconnected":
        return {
          color: colors.gray[600],
          bgColor: colors.gray[50],
          borderColor: colors.gray[200],
          label: "Disconnected",
        };
      case "failed":
        return {
          color: colors.error[600],
          bgColor: colors.error[50],
          borderColor: colors.error[200],
          label: "Failed",
        };
      case "closed":
        return {
          color: colors.gray[400],
          bgColor: colors.gray[50],
          borderColor: colors.gray[200],
          label: "Closed",
        };
      default:
        return {
          color: colors.gray[600],
          bgColor: colors.gray[50],
          borderColor: colors.gray[200],
          label: "Unknown",
        };
    }
  };

  const getQualityConfig = (quality?: ConnectionState["quality"]) => {
    switch (quality) {
      case "excellent":
        return { color: colors.success[600], label: "Excellent" };
      case "good":
        return { color: colors.primary[600], label: "Good" };
      case "fair":
        return { color: colors.warning[600], label: "Fair" };
      case "poor":
        return { color: colors.error[600], label: "Poor" };
      default:
        return { color: colors.gray[500], label: "Unknown" };
    }
  };

  const statusConfig = getStatusConfig(connectionState.status);
  const qualityConfig = getQualityConfig(connectionState.quality);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: statusConfig.bgColor,
          borderColor: statusConfig.borderColor,
        },
        style,
      ]}
    >
      <View style={styles.statusSection}>
        <StatusBadge 
          status={connectionState.status as any} 
          size="sm"
        />
      </View>

      {showDetails && (
        <View style={styles.detailsSection}>
          {connectionState.quality && (
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Quality:</Text>
              <Text style={[styles.detailValue, { color: qualityConfig.color }]}>
                {qualityConfig.label}
              </Text>
            </View>
          )}
          {connectionState.latency && (
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Latency:</Text>
              <Text style={styles.detailValue}>
                {formatLatency(connectionState.latency)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing[3],
  },
  
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  detailsSection: {
    flex: 1,
    flexDirection: "row",
    gap: spacing[4],
  },
  
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  
  detailLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  
  detailValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    fontFamily: "monospace",
  },
});
