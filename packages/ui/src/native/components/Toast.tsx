import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { colors, typography, spacing, borderRadius, shadows } from "../utils/styling";
import { safeArea } from "../utils/platform";

const { width: screenWidth } = Dimensions.get("window");

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      duration: 5000,
      type: "info",
      ...toast,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <View style={styles.container}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </View>
  );
};

interface ToastItemProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const slideAnim = React.useRef(new Animated.Value(screenWidth)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  const handleRemove = () => {
    // Slide out animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(toast.id);
    });
  };

  const getToastConfig = (type: ToastData["type"]) => {
    switch (type) {
      case "success":
        return {
          icon: "✅",
          backgroundColor: colors.success[50],
          borderColor: colors.success[200],
          textColor: colors.success[800],
        };
      case "error":
        return {
          icon: "❌",
          backgroundColor: colors.error[50],
          borderColor: colors.error[200],
          textColor: colors.error[800],
        };
      case "warning":
        return {
          icon: "⚠️",
          backgroundColor: colors.warning[50],
          borderColor: colors.warning[200],
          textColor: colors.warning[800],
        };
      case "info":
      default:
        return {
          icon: "ℹ️",
          backgroundColor: colors.info[50],
          borderColor: colors.info[200],
          textColor: colors.info[800],
        };
    }
  };

  const config = getToastConfig(toast.type);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.icon}>{config.icon}</Text>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: config.textColor }]}>
          {toast.title}
        </Text>
        
        {toast.description && (
          <Text style={[styles.description, { color: config.textColor }]}>
            {toast.description}
          </Text>
        )}
        
        {toast.action && (
          <TouchableOpacity
            onPress={toast.action.onPress}
            style={styles.actionButton}
          >
            <Text style={[styles.actionText, { color: config.textColor }]}>
              {toast.action.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity onPress={handleRemove} style={styles.closeButton}>
        <Text style={[styles.closeText, { color: config.textColor }]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: safeArea.top + spacing[4],
    left: spacing[4],
    right: spacing[4],
    zIndex: 1000,
    gap: spacing[2],
  },
  
  toast: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...shadows.md,
    gap: spacing[3],
  },
  
  icon: {
    fontSize: 20,
    marginTop: spacing[1],
  },
  
  content: {
    flex: 1,
    gap: spacing[1],
  },
  
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  
  description: {
    fontSize: typography.fontSize.sm,
    opacity: 0.9,
  },
  
  actionButton: {
    marginTop: spacing[2],
    alignSelf: "flex-start",
  },
  
  actionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textDecorationLine: "underline",
  },
  
  closeButton: {
    padding: spacing[1],
    marginTop: spacing[1],
  },
  
  closeText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
