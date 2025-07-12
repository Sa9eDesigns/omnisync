import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { colors, typography, spacing, borderRadius, shadows } from "../utils/styling";
import { haptics } from "../utils/platform";

export interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

const buttonVariants = {
  primary: {
    container: {
      backgroundColor: colors.primary[600],
      borderColor: colors.primary[600],
      borderWidth: 1,
    },
    text: {
      color: "#ffffff",
    },
    pressed: {
      backgroundColor: colors.primary[700],
      borderColor: colors.primary[700],
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.gray[600],
      borderColor: colors.gray[600],
      borderWidth: 1,
    },
    text: {
      color: "#ffffff",
    },
    pressed: {
      backgroundColor: colors.gray[700],
      borderColor: colors.gray[700],
    },
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderColor: colors.gray[300],
      borderWidth: 1,
    },
    text: {
      color: colors.gray[700],
    },
    pressed: {
      backgroundColor: colors.gray[50],
    },
  },
  ghost: {
    container: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 1,
    },
    text: {
      color: colors.gray[700],
    },
    pressed: {
      backgroundColor: colors.gray[100],
    },
  },
  destructive: {
    container: {
      backgroundColor: colors.error[600],
      borderColor: colors.error[600],
      borderWidth: 1,
    },
    text: {
      color: "#ffffff",
    },
    pressed: {
      backgroundColor: colors.error[700],
      borderColor: colors.error[700],
    },
  },
};

const buttonSizes = {
  sm: {
    container: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      minHeight: 32,
    },
    text: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.sm,
    },
    icon: 16,
  },
  md: {
    container: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      minHeight: 40,
    },
    text: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.sm,
    },
    icon: 16,
  },
  lg: {
    container: {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
      minHeight: 48,
    },
    text: {
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.base,
    },
    icon: 20,
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  style,
  textStyle,
  hapticFeedback = true,
  onPress,
  ...props
}) => {
  const [pressed, setPressed] = React.useState(false);

  const variantStyle = buttonVariants[variant];
  const sizeStyle = buttonSizes[size];
  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    setPressed(true);
    if (hapticFeedback) {
      haptics.light();
    }
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  const handlePress = (event: any) => {
    if (!isDisabled && onPress) {
      onPress(event);
    }
  };

  const containerStyle: ViewStyle = {
    ...styles.container,
    ...sizeStyle.container,
    ...variantStyle.container,
    ...(pressed && variantStyle.pressed),
    ...(fullWidth && { width: "100%" }),
    ...(isDisabled && styles.disabled),
    ...style,
  };

  const textStyleCombined: TextStyle = {
    ...styles.text,
    ...sizeStyle.text,
    ...variantStyle.text,
    ...(isDisabled && styles.disabledText),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variantStyle.text.color}
            style={styles.loader}
          />
        )}
        
        {!loading && leftIcon && (
          <View style={[styles.icon, { marginRight: spacing[2] }]}>
            {leftIcon}
          </View>
        )}
        
        <Text style={[textStyleCombined, loading && styles.hiddenText]}>
          {children}
        </Text>
        
        {!loading && rightIcon && (
          <View style={[styles.icon, { marginLeft: spacing[2] }]}>
            {rightIcon}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    ...shadows.sm,
  },
  
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  
  text: {
    fontWeight: typography.fontWeight.medium,
    textAlign: "center",
  },
  
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  
  loader: {
    position: "absolute",
  },
  
  hiddenText: {
    opacity: 0,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  disabledText: {
    opacity: 0.5,
  },
});

// Icon Button variant
interface IconButtonProps extends Omit<ButtonProps, "children" | "leftIcon" | "rightIcon"> {
  icon: React.ReactNode;
  accessibilityLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = "md",
  style,
  accessibilityLabel,
  ...props
}) => {
  const sizeStyle = buttonSizes[size];
  
  const iconButtonStyle: ViewStyle = {
    width: sizeStyle.container.minHeight,
    height: sizeStyle.container.minHeight,
    paddingHorizontal: 0,
    paddingVertical: 0,
    ...style,
  };

  return (
    <Button
      style={iconButtonStyle}
      size={size}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      {...props}
    >
      <View style={styles.icon}>
        {icon}
      </View>
    </Button>
  );
};
