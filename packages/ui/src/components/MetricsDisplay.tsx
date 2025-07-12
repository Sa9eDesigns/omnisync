import React from "react";
import { Progress } from "@base-ui-components/react/progress";
import { cn } from "../utils/cn";
import { type AudioMetrics, formatLatency } from "@omnisync/shared";
import { 
  Activity, 
  Wifi, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface MetricsDisplayProps {
  metrics: AudioMetrics;
  className?: string;
  compact?: boolean;
}

interface MetricItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  status?: "good" | "warning" | "error";
  trend?: "up" | "down" | "stable";
  className?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({
  label,
  value,
  icon,
  status = "good",
  trend,
  className,
}) => {
  const statusColors = {
    good: "text-green-600 bg-green-50 border-green-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
    error: "text-red-600 bg-red-50 border-red-200",
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3" />;
      case "down":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        statusColors[status],
        className
      )}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-lg font-semibold">{value}</span>
          {getTrendIcon()}
        </div>
      </div>
    </div>
  );
};

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  metrics,
  className,
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
    if (level > 0.8) return "bg-red-500";
    if (level > 0.6) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (compact) {
    return (
      <div className={cn("omnisync-component flex items-center gap-4", className)}>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-mono">
            {formatLatency(metrics.roundTripTime)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {metrics.packetsLost > 0 ? `${metrics.packetsLost} lost` : "No loss"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-500" />
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-200 rounded-full",
                getAudioLevelColor(metrics.inputLevel)
              )}
              style={{ width: `${metrics.inputLevel * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("omnisync-component space-y-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Audio Metrics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Input Level</span>
            <span className="text-sm text-gray-500">
              {Math.round(metrics.inputLevel * 100)}%
            </span>
          </div>
          <Progress.Root
            value={metrics.inputLevel * 100}
            className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden"
          >
            <Progress.Indicator
              className={cn(
                "h-full transition-all duration-200 rounded-full",
                getAudioLevelColor(metrics.inputLevel)
              )}
              style={{ width: `${metrics.inputLevel * 100}%` }}
            />
          </Progress.Root>
        </div>

        {/* Output Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Output Level</span>
            <span className="text-sm text-gray-500">
              {Math.round(metrics.outputLevel * 100)}%
            </span>
          </div>
          <Progress.Root
            value={metrics.outputLevel * 100}
            className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden"
          >
            <Progress.Indicator
              className={cn(
                "h-full transition-all duration-200 rounded-full",
                getAudioLevelColor(metrics.outputLevel)
              )}
              style={{ width: `${metrics.outputLevel * 100}%` }}
            />
          </Progress.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Round Trip Time */}
        <MetricItem
          label="Latency"
          value={formatLatency(metrics.roundTripTime)}
          icon={<Clock className="h-5 w-5" />}
          status={getLatencyStatus(metrics.roundTripTime)}
        />

        {/* Jitter */}
        <MetricItem
          label="Jitter"
          value={`${Math.round(metrics.jitter)}ms`}
          icon={<Activity className="h-5 w-5" />}
          status={getJitterStatus(metrics.jitter)}
        />

        {/* Packet Loss */}
        <MetricItem
          label="Packet Loss"
          value={metrics.packetsLost === 0 ? "None" : `${metrics.packetsLost}`}
          icon={
            metrics.packetsLost > 0 ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Wifi className="h-5 w-5" />
            )
          }
          status={getPacketLossStatus(metrics.packetsLost)}
        />
      </div>
    </div>
  );
};
