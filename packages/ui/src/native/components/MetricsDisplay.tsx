import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { type AudioMetrics, formatLatency } from "@omnisync/shared";
import { colors, typography, spacing, borderRadius } from "../utils/styling";

interface MetricsDisplayProps {
  metrics: AudioMetrics;
  style?: any;
  compact?: boolean;
}

interface MetricItemProps {
  label: string;
  value: string | number;
  icon: string;
  status?: "good" | "warning" | "error";
  style?: any;
}

const MetricItem: React.FC<MetricItemProps> = ({
  label,
  value,
  icon,
  status = "good",
  style,
}) => {
  const statusColors = {
    good: {
      bg: colors.success[50],
      border: colors.success[200],
      text: colors.success[800],
    },
    warning: {
      bg: colors.warning[50],
      border: colors.warning[200],
      text: colors.warning[800],
    },
    error: {
      bg: colors.error[50],
      border: colors.error[200],
      text: colors.error[800],
    },
  };

  const statusStyle = statusColors[status];

  return (
    <View
      style={[
        styles.metricItem,
        {
          backgroundColor: statusStyle.bg,
          borderColor: statusStyle.border,
        },
        style,
      ]}
    >
      <Text style={styles.metricIcon}>{icon}</Text>
      <View style={styles.metricContent}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={[styles.metricValue, { color: statusStyle.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  metrics,
  style,
  compact = false,
}) => {
  const getLatencyStatus = (rtt: number) => {
    if (rtt > 200) return "error";
    if (rtt > 100) return "warning";
    return "good";
  };

  const getJitterStatus = (jitter: number) => {
    if (jitter > 50) return "error";
    if (jitter > 30) return "warning";
    return "good";
  };

  const getPacketLossStatus = (packetsLost: number) => {
    if (packetsLost > 5) return "error";
    if (packetsLost > 2) return "warning";
    return "good";
  };

  const getAudioLevelColor = (level: number) => {
    if (level > 0.8) return colors.error[500];
    if (level > 0.6) return colors.warning[500];
    return colors.success[500];
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <View style={styles.compactItem}>
          <Text style={styles.compactIcon}>🕐</Text>
          <Text style={styles.compactText}>
            {formatLatency(metrics.roundTripTime)}
          </Text>
        </View>
        
        <View style={styles.compactItem}>
          <Text style={styles.compactIcon}>📶</Text>
          <Text style={styles.compactText}>
            {metrics.packetsLost > 0 ? `${metrics.packetsLost} lost` : "No loss"}
          </Text>
        </View>
        
        <View style={styles.compactItem}>
          <Text style={styles.compactIcon}>🎵</Text>
          <View style={styles.compactLevel}>
            <View style={styles.compactLevelTrack}>
              <View
                style={[
                  styles.compactLevelFill,
                  {
                    width: `${metrics.inputLevel * 100}%`,
                    backgroundColor: getAudioLevelColor(metrics.inputLevel),
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📊</Text>
        <Text style={styles.headerTitle}>Audio Metrics</Text>
      </View>

      {/* Audio Levels */}
      <View style={styles.levelsSection}>
        <View style={styles.levelItem}>
          <Text style={styles.levelLabel}>Input Level</Text>
          <Text style={styles.levelValue}>
            {Math.round(metrics.inputLevel * 100)}%
          </Text>
          <View style={styles.levelTrack}>
            <View
              style={[
                styles.levelFill,
                {
                  width: `${metrics.inputLevel * 100}%`,
                  backgroundColor: getAudioLevelColor(metrics.inputLevel),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.levelItem}>
          <Text style={styles.levelLabel}>Output Level</Text>
          <Text style={styles.levelValue}>
            {Math.round(metrics.outputLevel * 100)}%
          </Text>
          <View style={styles.levelTrack}>
            <View
              style={[
                styles.levelFill,
                {
                  width: `${metrics.outputLevel * 100}%`,
                  backgroundColor: getAudioLevelColor(metrics.outputLevel),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Performance Metrics */}
      <View style={styles.metricsGrid}>
        <MetricItem
          label="Latency"
          value={formatLatency(metrics.roundTripTime)}
          icon="🕐"
          status={getLatencyStatus(metrics.roundTripTime)}
        />

        <MetricItem
          label="Jitter"
          value={`${Math.round(metrics.jitter)}ms`}
          icon="📊"
          status={getJitterStatus(metrics.jitter)}
        />

        <MetricItem
          label="Packet Loss"
          value={metrics.packetsLost === 0 ? "None" : `${metrics.packetsLost}`}
          icon={metrics.packetsLost > 0 ? "⚠️" : "📶"}
          status={getPacketLossStatus(metrics.packetsLost)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  
  headerIcon: {
    fontSize: 20,
  },
  
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray[900],
  },
  
  levelsSection: {
    gap: spacing[3],
  },
  
  levelItem: {
    gap: spacing[2],
  },
  
  levelLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[700],
  },
  
  levelValue: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    position: "absolute",
    right: 0,
    top: 0,
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
  
  metricsGrid: {
    gap: spacing[3],
  },
  
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing[3],
  },
  
  metricIcon: {
    fontSize: 20,
  },
  
  metricContent: {
    flex: 1,
  },
  
  metricLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[600],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  metricValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing[1],
  },
  
  // Compact styles
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  
  compactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  
  compactIcon: {
    fontSize: 16,
  },
  
  compactText: {
    fontSize: typography.fontSize.sm,
    fontFamily: "monospace",
  },
  
  compactLevel: {
    width: 60,
  },
  
  compactLevelTrack: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    overflow: "hidden",
  },
  
  compactLevelFill: {
    height: "100%",
    borderRadius: 3,
  },
});
