import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/styling";
import { safeArea } from "../utils/platform";

const { width: screenWidth } = Dimensions.get("window");

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
  width?: number;
  style?: any;
}

export const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  children,
  side = "left",
  width = screenWidth * 0.8,
  style,
}) => {
  const slideAnim = useRef(
    new Animated.Value(side === "left" ? -width : width)
  ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: side === "left" ? -width : width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim, side, width]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: fadeAnim },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width,
            [side]: 0,
            transform: [{ translateX: slideAnim }],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

// Drawer Header Component
interface DrawerHeaderProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  style?: any;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  title,
  subtitle,
  onClose,
  style,
}) => (
  <View style={[styles.header, style]}>
    <View style={styles.headerContent}>
      {title && <Text style={styles.headerTitle}>{title}</Text>}
      {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
    {onClose && (
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Drawer Content Component
interface DrawerContentProps {
  children: React.ReactNode;
  style?: any;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  children,
  style,
}) => (
  <View style={[styles.content, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  
  backdropTouchable: {
    flex: 1,
  },
  
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    ...shadows.lg,
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  
  headerContent: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[900],
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing[2],
  },
  
  closeButtonText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  
  content: {
    flex: 1,
    padding: spacing[4],
  },
});
