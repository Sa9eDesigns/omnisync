import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "../utils/styling";
import { Button } from "./Button";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  style?: any;
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  description,
  action,
  dismissible = false,
  onDismiss,
  style,
}) => {
  const getAlertConfig = (alertType: AlertProps["type"]) => {
    switch (alertType) {
      case "success":
        return {
          icon: "✅",
          backgroundColor: colors.success[50],
          borderColor: colors.success[200],
          textColor: colors.success[800],
          iconColor: colors.success[600],
        };
      case "warning":
        return {
          icon: "⚠️",
          backgroundColor: colors.warning[50],
          borderColor: colors.warning[200],
          textColor: colors.warning[800],
          iconColor: colors.warning[600],
        };
      case "error":
        return {
          icon: "❌",
          backgroundColor: colors.error[50],
          borderColor: colors.error[200],
          textColor: colors.error[800],
          iconColor: colors.error[600],
        };
      case "info":
      default:
        return {
          icon: "ℹ️",
          backgroundColor: colors.info[50],
          borderColor: colors.info[200],
          textColor: colors.info[800],
          iconColor: colors.info[600],
        };
    }
  };

  const config = getAlertConfig(type);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{config.icon}</Text>
          <View style={styles.textContent}>
            {title && (
              <Text style={[styles.title, { color: config.textColor }]}>
                {title}
              </Text>
            )}
            <Text style={[styles.description, { color: config.textColor }]}>
              {description}
            </Text>
          </View>
          {dismissible && onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onPress={onDismiss}
              style={styles.dismissButton}
            >
              ✕
            </Button>
          )}
        </View>
        
        {action && (
          <View style={styles.actionContainer}>
            <Button
              variant="outline"
              size="sm"
              onPress={action.onPress}
              style={[styles.actionButton, { borderColor: config.borderColor }]}
              textStyle={{ color: config.textColor }}
            >
              {action.label}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
  },
  
  content: {
    gap: spacing[3],
  },
  
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  
  icon: {
    fontSize: 20,
    marginTop: spacing[1],
  },
  
  textContent: {
    flex: 1,
    gap: spacing[1],
  },
  
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  
  description: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm * 1.2,
  },
  
  dismissButton: {
    width: 32,
    height: 32,
    padding: 0,
  },
  
  actionContainer: {
    alignItems: "flex-start",
    marginLeft: spacing[8], // Align with text content
  },
  
  actionButton: {
    backgroundColor: "transparent",
  },
});
