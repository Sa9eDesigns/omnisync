import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, typography, spacing, borderRadius, shadows } from "../utils/styling";
import { haptics } from "../utils/platform";

export interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
  hapticFeedback?: boolean;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  style?: ViewStyle;
}

export interface CardContentProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  style?: ViewStyle;
}

export interface CardFooterProps {
  children: React.ReactNode;
  justify?: "start" | "center" | "end" | "between";
  style?: ViewStyle;
}

const cardVariants = {
  default: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
    borderWidth: 1,
    ...shadows.sm,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: colors.gray[200],
    borderWidth: 2,
  },
  ghost: {
    backgroundColor: colors.gray[50],
    borderColor: "transparent",
    borderWidth: 0,
  },
};

const cardSizes = {
  sm: {
    padding: spacing[3],
  },
  md: {
    padding: spacing[4],
  },
  lg: {
    padding: spacing[6],
  },
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  size = "md",
  interactive = false,
  loading = false,
  style,
  onPress,
  hapticFeedback = true,
}) => {
  const handlePress = () => {
    if (hapticFeedback) {
      haptics.light();
    }
    onPress?.();
  };

  const cardStyle: ViewStyle = {
    ...styles.container,
    ...cardVariants[variant],
    ...cardSizes[size],
    ...(loading && styles.loading),
    ...style,
  };

  if (interactive && onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  actions,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>{children}</View>
      {actions && <View style={styles.headerActions}>{actions}</View>}
    </View>
  );
};

export const CardTitle: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

export const CardDescription: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

export const CardContent: React.FC<CardContentProps> = ({
  children,
  padding = "md",
  style,
}) => {
  const paddingStyles = {
    none: {},
    sm: { paddingTop: spacing[3] },
    md: { paddingTop: spacing[4] },
    lg: { paddingTop: spacing[6] },
  };

  return (
    <View style={[paddingStyles[padding], style]}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  justify = "end",
  style,
}) => {
  const justifyStyles = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
  };

  return (
    <View
      style={[
        styles.footer,
        { justifyContent: justifyStyles[justify] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Stats Card variant
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  style,
  onPress,
}) => (
  <Card
    variant="default"
    interactive={!!onPress}
    onPress={onPress}
    style={style}
  >
    <View style={styles.statsContainer}>
      <View style={styles.statsContent}>
        <Text style={styles.statsTitle}>{title}</Text>
        <Text style={styles.statsValue}>{value}</Text>
        {description && (
          <Text style={styles.statsDescription}>{description}</Text>
        )}
        {trend && (
          <View style={styles.trendContainer}>
            <Text
              style={[
                styles.trendText,
                trend.isPositive ? styles.trendPositive : styles.trendNegative,
              ]}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </Text>
            <Text style={styles.trendLabel}>from last period</Text>
          </View>
        )}
      </View>
      {icon && <View style={styles.statsIcon}>{icon}</View>}
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  
  loading: {
    opacity: 0.6,
  },
  
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  
  headerContent: {
    flex: 1,
    marginRight: spacing[2],
  },
  
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  
  title: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray[900],
  },
  
  description: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
  
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    gap: spacing[2],
  },
  
  // Stats Card styles
  statsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  
  statsContent: {
    flex: 1,
  },
  
  statsTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[600],
    marginBottom: spacing[1],
  },
  
  statsValue: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray[900],
    marginBottom: spacing[1],
  },
  
  statsDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginBottom: spacing[2],
  },
  
  statsIcon: {
    marginLeft: spacing[4],
    alignItems: "center",
    justifyContent: "center",
  },
  
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  
  trendText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  
  trendPositive: {
    color: colors.success[600],
  },
  
  trendNegative: {
    color: colors.error[600],
  },
  
  trendLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
});
