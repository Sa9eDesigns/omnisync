import React, { useEffect, useRef } from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
  Dimensions,
  ScrollView,
} from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/styling";
import { safeArea, haptics } from "../utils/platform";

// Optional gesture handler imports (will be handled gracefully if not available)
let PanGestureHandler: any;
let State: any;

try {
  const gestureHandler = require("react-native-gesture-handler");
  PanGestureHandler = gestureHandler.PanGestureHandler;
  State = gestureHandler.State;
} catch (e) {
  // Gesture handler not available - components will work without gestures
  PanGestureHandler = View;
  State = { ACTIVE: 4 };
}

const { height: screenHeight } = Dimensions.get("window");

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  position?: "center" | "bottom";
  animationType?: "slide" | "fade";
  dismissible?: boolean;
  style?: ViewStyle;
}

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  style?: ViewStyle;
}

const modalSizes = {
  sm: { maxHeight: screenHeight * 0.4 },
  md: { maxHeight: screenHeight * 0.6 },
  lg: { maxHeight: screenHeight * 0.8 },
  full: { height: screenHeight },
};

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  size = "md",
  position = "center",
  animationType = "slide",
  dismissible = true,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (animationType === "slide" && position === "bottom") {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      if (animationType === "slide" && position === "bottom") {
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animationType, position, slideAnim, fadeAnim]);

  const handleBackdropPress = () => {
    if (dismissible) {
      haptics.light();
      onClose();
    }
  };

  const getModalStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.modal,
      ...modalSizes[size],
      ...style,
    };

    if (position === "bottom") {
      return {
        ...baseStyle,
        ...styles.bottomModal,
        transform: [{ translateY: slideAnim }],
      };
    }

    return {
      ...baseStyle,
      ...styles.centerModal,
    };
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: fadeAnim },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />
        
        <Animated.View style={getModalStyle()}>
          {position === "bottom" && (
            <View style={styles.dragIndicator} />
          )}
          {children}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
};

// Bottom Sheet Component with gesture handling
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  snapPoints = ["50%"],
  enablePanDownToClose = true,
  style,
}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const gestureHandler = useRef<any>();

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY, velocityY } = event.nativeEvent;
      
      if (translationY > 100 || velocityY > 500) {
        // Close the sheet
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onClose();
        });
      } else {
        // Snap back to position
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  };

  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <PanGestureHandler
          ref={gestureHandler}
          onGestureEvent={enablePanDownToClose ? onGestureEvent : undefined}
          onHandlerStateChange={enablePanDownToClose ? onHandlerStateChange : undefined}
        >
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY }],
              },
              style,
            ]}
          >
            <View style={styles.dragIndicator} />
            {children}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </RNModal>
  );
};

// Modal Header Component
export interface ModalHeaderProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  actions?: React.ReactNode;
  style?: ViewStyle;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  onClose,
  actions,
  style,
}) => (
  <View style={[styles.header, style]}>
    <View style={styles.headerContent}>
      {title && <Text style={styles.headerTitle}>{title}</Text>}
      {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
    
    <View style={styles.headerActions}>
      {actions}
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// Modal Content Component
export interface ModalContentProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  scrollable = false,
  style,
}) => {
  if (scrollable) {
    return (
      <ScrollView
        style={[styles.content, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
};

// Modal Footer Component
export interface ModalFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  style,
}) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  
  backdropTouchable: {
    flex: 1,
  },
  
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  
  centerModal: {
    position: "absolute",
    top: "50%",
    left: spacing[4],
    right: spacing[4],
    transform: [{ translateY: -200 }],
  },
  
  bottomModal: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: safeArea.bottom,
  },
  
  bottomSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: safeArea.bottom,
    minHeight: 200,
    ...shadows.lg,
  },
  
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
    alignSelf: "center",
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  
  headerContent: {
    flex: 1,
    marginRight: spacing[2],
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[900],
    marginBottom: spacing[1],
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
  },
  
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
  
  closeButtonText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  
  content: {
    padding: spacing[4],
    flex: 1,
  },
  
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    gap: spacing[2],
  },
});
