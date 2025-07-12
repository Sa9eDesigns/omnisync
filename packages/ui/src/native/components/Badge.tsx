import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../utils/styling";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const badgeVariants = {
  default: {
    container: {
      backgroundColor: colors.primary[100],
      borderColor: colors.primary[200],
    },
    text: {
      color: colors.primary[800],
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.gray[100],
      borderColor: colors.gray[200],
    },
    text: {
      color: colors.gray[800],
    },
  },
  success: {
    container: {
      backgroundColor: colors.success[100],
      borderColor: colors.success[200],
    },
    text: {
      color: colors.success[800],
    },
  },
  warning: {
    container: {
      backgroundColor: colors.warning[100],
      borderColor: colors.warning[200],
    },
    text: {
      color: colors.warning[800],
    },
  },
  error: {
    container: {
      backgroundColor: colors.error[100],
      borderColor: colors.error[200],
    },
    text: {
      color: colors.error[800],
    },
  },
  info: {
    container: {
      backgroundColor: colors.info[100],
      borderColor: colors.info[200],
    },
    text: {
      color: colors.info[800],
    },
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderColor: colors.gray[300],
    },
    text: {
      color: colors.gray[700],
    },
  },
};

const badgeSizes = {
  sm: {
    container: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    text: {
      fontSize: typography.fontSize.xs,
    },
  },
  md: {
    container: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    text: {
      fontSize: typography.fontSize.sm,
    },
  },
  lg: {
    container: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    text: {
      fontSize: typography.fontSize.base,
    },
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  style,
  textStyle,
}) => {
  const variantStyle = badgeVariants[variant];
  const sizeStyle = badgeSizes[size];

  return (
    <View
      style={[
        styles.container,
        sizeStyle.container,
        variantStyle.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          sizeStyle.text,
          variantStyle.text,
          textStyle,
        ]}
      >
        {children}
      </Text>
      
      {removable && onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.removeText, variantStyle.text]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Status Badge variant
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
    <View style={styles.statusContainer}>
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor:
              status === "online" ? colors.success[500] :
              status === "offline" ? colors.gray[400] :
              status === "away" ? colors.warning[500] :
              status === "busy" ? colors.error[500] :
              colors.info[500],
          },
        ]}
      />
      <Badge variant={config.variant} {...props}>
        {children || config.text}
      </Badge>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  
  text: {
    fontWeight: typography.fontWeight.medium,
  },
  
  removeButton: {
    marginLeft: spacing[1],
    padding: spacing[1],
  },
  
  removeText: {
    fontSize: typography.fontSize.xs,
  },
  
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
