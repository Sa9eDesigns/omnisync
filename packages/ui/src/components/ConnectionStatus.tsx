import React from "react";
import { type ConnectionState, formatLatency } from "@omnisync/shared";
import { cn } from "../utils/cn";
import {
  Wifi,
  WifiOff,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface ConnectionStatusProps {
  connectionState: ConnectionState;
  className?: string;
  showDetails?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectionState,
  className,
  showDetails = true,
}) => {
  const getStatusConfig = (status: ConnectionState["status"]) => {
    switch (status) {
      case "connected":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Connected",
        };
      case "connecting":
        return {
          icon: Loader2,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          label: "Connecting",
          animate: true,
        };
      case "disconnected":
        return {
          icon: WifiOff,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: "Disconnected",
        };
      case "failed":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Failed",
        };
      case "closed":
        return {
          icon: WifiOff,
          color: "text-gray-400",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: "Closed",
        };
      default:
        return {
          icon: AlertTriangle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: "Unknown",
        };
    }
  };

  const getQualityConfig = (quality?: ConnectionState["quality"]) => {
    switch (quality) {
      case "excellent":
        return { color: "text-green-600", label: "Excellent" };
      case "good":
        return { color: "text-blue-600", label: "Good" };
      case "fair":
        return { color: "text-yellow-600", label: "Fair" };
      case "poor":
        return { color: "text-red-600", label: "Poor" };
      default:
        return { color: "text-gray-500", label: "Unknown" };
    }
  };

  const statusConfig = getStatusConfig(connectionState.status);
  const qualityConfig = getQualityConfig(connectionState.quality);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={cn(
        "omnisync-component flex items-center gap-3 p-3 rounded-lg border transition-colors",
        statusConfig.bgColor,
        statusConfig.borderColor,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <StatusIcon
          className={cn(
            "h-5 w-5",
            statusConfig.color,
            statusConfig.animate && "animate-spin"
          )}
        />
        <span className={cn("font-medium text-sm", statusConfig.color)}>
          {statusConfig.label}
        </span>
      </div>

      {showDetails && (
        <div className="flex items-center gap-4 text-xs text-gray-600">
          {connectionState.quality && (
            <div className="flex items-center gap-1">
              <span>Quality:</span>
              <span className={qualityConfig.color}>
                {qualityConfig.label}
              </span>
            </div>
          )}
          {connectionState.latency && (
            <div className="flex items-center gap-1">
              <span>Latency:</span>
              <span className="font-mono">
                {formatLatency(connectionState.latency)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
