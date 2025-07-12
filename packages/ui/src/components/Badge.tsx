import React from "react";
import { cn } from "../utils/cn";
import { X } from "lucide-react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  pulse?: boolean;
}

const badgeVariants = {
  default: [
    "bg-blue-100 text-blue-800 border-blue-200",
    "dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
  ],
  secondary: [
    "bg-gray-100 text-gray-800 border-gray-200",
    "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  ],
  success: [
    "bg-green-100 text-green-800 border-green-200",
    "dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
  ],
  warning: [
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
  ],
  error: [
    "bg-red-100 text-red-800 border-red-200",
    "dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
  ],
  info: [
    "bg-cyan-100 text-cyan-800 border-cyan-200",
    "dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-800",
  ],
  outline: [
    "bg-transparent text-gray-700 border-gray-300",
    "dark:text-gray-300 dark:border-gray-600",
  ],
};

const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      removable = false,
      onRemove,
      icon,
      pulse = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "omnisync-component inline-flex items-center gap-1 font-medium rounded-full border transition-all duration-200",
          
          // Variant styles
          badgeVariants[variant],
          
          // Size styles
          badgeSizes[size],
          
          // Pulse animation
          pulse && "animate-pulse",
          
          // Removable styles
          removable && "pr-1",
          
          className
        )}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0">
            {React.cloneElement(icon as React.ReactElement, {
              className: cn(
                size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5",
                (icon as React.ReactElement).props?.className
              ),
            })}
          </span>
        )}
        
        <span className="truncate">{children}</span>
        
        {removable && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              "flex-shrink-0 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current",
              "transition-colors duration-150"
            )}
          >
            <X className={cn(
              size === "sm" ? "h-2.5 w-2.5" : size === "md" ? "h-3 w-3" : "h-4 w-4"
            )} />
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = "Badge";

// Status Badge - for connection states, etc.
interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: "online" | "offline" | "away" | "busy" | "connecting";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  ...props
}) => {
  const statusConfig = {
    online: { variant: "success" as const, text: "Online" },
    offline: { variant: "secondary" as const, text: "Offline" },
    away: { variant: "warning" as const, text: "Away" },
    busy: { variant: "error" as const, text: "Busy" },
    connecting: { variant: "info" as const, text: "Connecting" },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      pulse={status === "connecting"}
      icon={
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            status === "online" && "bg-green-500",
            status === "offline" && "bg-gray-400",
            status === "away" && "bg-yellow-500",
            status === "busy" && "bg-red-500",
            status === "connecting" && "bg-blue-500"
          )}
        />
      }
      {...props}
    >
      {children || config.text}
    </Badge>
  );
};

// Notification Badge - for counts, etc.
interface NotificationBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  className,
  size = "sm",
}) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant="error"
      size={size}
      className={cn(
        "absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 justify-center",
        size === "sm" && "text-xs min-w-[1rem] h-4",
        size === "lg" && "text-sm min-w-[1.5rem] h-6",
        className
      )}
    >
      {displayCount}
    </Badge>
  );
};

// Tag Badge - for categories, labels, etc.
interface TagBadgeProps extends Omit<BadgeProps, "variant"> {
  color?: string;
  textColor?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  color,
  textColor,
  className,
  style,
  ...props
}) => {
  const customStyle = {
    ...style,
    ...(color && { backgroundColor: color }),
    ...(textColor && { color: textColor }),
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        color && "border-current",
        className
      )}
      style={customStyle}
      {...props}
    />
  );
};

// Badge Group - for displaying multiple badges
interface BadgeGroupProps {
  badges: Array<{
    id: string;
    label: string;
    variant?: BadgeProps["variant"];
    removable?: boolean;
    onRemove?: () => void;
  }>;
  max?: number;
  className?: string;
  size?: BadgeProps["size"];
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  badges,
  max,
  className,
  size = "md",
}) => {
  const visibleBadges = max ? badges.slice(0, max) : badges;
  const hiddenCount = max && badges.length > max ? badges.length - max : 0;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {visibleBadges.map((badge) => (
        <Badge
          key={badge.id}
          variant={badge.variant}
          size={size}
          removable={badge.removable}
          onRemove={badge.onRemove}
        >
          {badge.label}
        </Badge>
      ))}
      
      {hiddenCount > 0 && (
        <Badge variant="secondary" size={size}>
          +{hiddenCount} more
        </Badge>
      )}
    </div>
  );
};
