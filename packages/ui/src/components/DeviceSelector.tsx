import React from "react";
import { Select } from "@base-ui-components/react/select";
import { cn } from "../utils/cn";
import { Mic, Speaker, ChevronDown, Check } from "lucide-react";

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
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedDeviceId,
  onDeviceChange,
  type,
  className,
  disabled = false,
  placeholder,
}) => {
  const filteredDevices = devices.filter(device => 
    type === "input" ? device.kind === "audioinput" : device.kind === "audiooutput"
  );

  const selectedDevice = filteredDevices.find(device => device.deviceId === selectedDeviceId);
  const Icon = type === "input" ? Mic : Speaker;

  const defaultPlaceholder = type === "input" 
    ? "Select microphone..." 
    : "Select speaker...";

  return (
    <div className={cn("omnisync-component", className)}>
      <Select.Root
        value={selectedDeviceId}
        onValueChange={onDeviceChange}
        disabled={disabled}
      >
        <Select.Trigger
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm",
            "bg-white border border-gray-300 rounded-md shadow-sm",
            "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            "transition-colors duration-200"
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">
              {selectedDevice?.label || placeholder || defaultPlaceholder}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner sideOffset={4}>
            <Select.Popup
              className={cn(
                "bg-white border border-gray-200 rounded-md shadow-lg",
                "max-h-60 overflow-auto z-50 min-w-[200px]",
                "animate-slide-in"
              )}
            >
              {filteredDevices.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No {type === "input" ? "microphones" : "speakers"} found
                </div>
              ) : (
                filteredDevices.map((device) => (
                  <Select.Option
                    key={device.deviceId}
                    value={device.deviceId}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm cursor-pointer",
                      "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                      "data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-900"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{device.label}</span>
                    </div>
                    <Select.OptionIndicator>
                      <Check className="h-4 w-4 text-blue-600" />
                    </Select.OptionIndicator>
                  </Select.Option>
                ))
              )}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
