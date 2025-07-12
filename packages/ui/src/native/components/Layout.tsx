import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from "react-native";
import { colors, spacing, useBreakpoint } from "../utils/styling";
import { safeArea } from "../utils/platform";

const { width: screenWidth } = Dimensions.get("window");

export interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

export interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  style?: ViewStyle;
  padding?: boolean;
}

export interface StackProps {
  children: React.ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  style?: ViewStyle;
}

export interface InlineProps {
  children: React.ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  style?: ViewStyle;
}

export interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  style?: ViewStyle;
}

// Root Layout Component
export const Layout: React.FC<LayoutProps> = ({
  children,
  style,
  backgroundColor = colors.gray[50],
}) => {
  return (
    <SafeAreaView style={[styles.layout, { backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
};

// Container Component
export const Container: React.FC<ContainerProps> = ({
  children,
  size = "lg",
  style,
  padding = true,
}) => {
  const { width } = useBreakpoint();
  
  const maxWidths = {
    sm: Math.min(width, 640),
    md: Math.min(width, 768),
    lg: Math.min(width, 1024),
    xl: Math.min(width, 1280),
    full: width,
  };

  const containerStyle: ViewStyle = {
    width: "100%",
    maxWidth: maxWidths[size],
    alignSelf: "center",
    ...(padding && {
      paddingHorizontal: spacing[4],
    }),
    ...style,
  };

  return <View style={containerStyle}>{children}</View>;
};

// Stack Component (Vertical Layout)
export const Stack: React.FC<StackProps> = ({
  children,
  gap = "md",
  align = "stretch",
  style,
}) => {
  const gapValues = {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  };

  const alignItems = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  } as const;

  return (
    <View
      style={[
        styles.stack,
        {
          gap: gapValues[gap],
          alignItems: alignItems[align],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Inline Component (Horizontal Layout)
export const Inline: React.FC<InlineProps> = ({
  children,
  gap = "md",
  align = "center",
  justify = "start",
  wrap = false,
  style,
}) => {
  const gapValues = {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  };

  const alignItems = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    baseline: "baseline",
  } as const;

  const justifyContent = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  } as const;

  return (
    <View
      style={[
        styles.inline,
        {
          gap: gapValues[gap],
          alignItems: alignItems[align],
          justifyContent: justifyContent[justify],
          flexWrap: wrap ? "wrap" : "nowrap",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Grid Component
export const Grid: React.FC<GridProps> = ({
  children,
  cols = 2,
  gap = "md",
  style,
}) => {
  const gapValues = {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  };

  const childrenArray = React.Children.toArray(children);
  const rows: React.ReactNode[][] = [];
  
  for (let i = 0; i < childrenArray.length; i += cols) {
    rows.push(childrenArray.slice(i, i + cols));
  }

  return (
    <View style={[{ gap: gapValues[gap] }, style]}>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.gridRow,
            { gap: gapValues[gap] },
          ]}
        >
          {row.map((child, colIndex) => (
            <View key={colIndex} style={styles.gridItem}>
              {child}
            </View>
          ))}
          {/* Fill remaining columns with empty views */}
          {row.length < cols &&
            Array.from({ length: cols - row.length }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.gridItem} />
            ))}
        </View>
      ))}
    </View>
  );
};

// Screen Component (Full screen with safe area)
export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  backgroundColor = colors.gray[50],
  edges = ["top", "bottom"],
}) => {
  const safeAreaStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    ...(edges.includes("top") && { paddingTop: safeArea.top }),
    ...(edges.includes("bottom") && { paddingBottom: safeArea.bottom }),
  };

  if (scrollable) {
    return (
      <View style={[safeAreaStyle, style]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[safeAreaStyle, style]}>
      {children}
    </View>
  );
};

// Section Component (Content section with optional title)
export interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
}

export const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  style,
  headerStyle,
}) => {
  return (
    <View style={[styles.section, style]}>
      {(title || subtitle) && (
        <View style={[styles.sectionHeader, headerStyle]}>
          {title && (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          {subtitle && (
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          )}
        </View>
      )}
      {children}
    </View>
  );
};

// Responsive Hook for React Native
export const useResponsive = () => {
  const { width, height, isMobile, isTablet } = useBreakpoint();
  
  return {
    width,
    height,
    isMobile,
    isTablet,
    isLandscape: width > height,
    isPortrait: height > width,
    // Responsive value helper
    select: function<T>(values: { mobile: T; tablet?: T; desktop?: T }): T {
      if (isMobile) return values.mobile;
      if (isTablet && values.tablet) return values.tablet;
      return values.desktop || values.tablet || values.mobile;
    },
  };
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  
  stack: {
    flexDirection: "column",
  },
  
  inline: {
    flexDirection: "row",
  },
  
  gridRow: {
    flexDirection: "row",
  },
  
  gridItem: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
  },
  
  section: {
    marginBottom: spacing[6],
  },
  
  sectionHeader: {
    marginBottom: spacing[4],
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.gray[900],
    marginBottom: spacing[1],
  },
  
  sectionSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
  },
});
