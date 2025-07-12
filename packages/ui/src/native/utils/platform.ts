import { Platform, StatusBar } from "react-native";

// Platform detection
export const platform = {
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
  isWeb: Platform.OS === "web",
  version: Platform.Version,
};

// Status bar utilities
export const statusBar = {
  height: StatusBar.currentHeight || (platform.isIOS ? 44 : 24),
  
  setStyle: (style: "default" | "light-content" | "dark-content") => {
    StatusBar.setBarStyle(style, true);
  },
  
  setBackgroundColor: (color: string, animated: boolean = true) => {
    if (platform.isAndroid) {
      StatusBar.setBackgroundColor(color, animated);
    }
  },
  
  hide: () => StatusBar.setHidden(true, "slide"),
  show: () => StatusBar.setHidden(false, "slide"),
};

// Haptic feedback (iOS only)
export const haptics = {
  light: () => {
    if (platform.isIOS) {
      // Use Expo Haptics if available
      try {
        const { Haptics } = require("expo-haptics");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        // Fallback or ignore if Expo Haptics not available
      }
    }
  },
  
  medium: () => {
    if (platform.isIOS) {
      try {
        const { Haptics } = require("expo-haptics");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {
        // Fallback or ignore
      }
    }
  },
  
  heavy: () => {
    if (platform.isIOS) {
      try {
        const { Haptics } = require("expo-haptics");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (e) {
        // Fallback or ignore
      }
    }
  },
  
  success: () => {
    if (platform.isIOS) {
      try {
        const { Haptics } = require("expo-haptics");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        // Fallback or ignore
      }
    }
  },
  
  warning: () => {
    if (platform.isIOS) {
      try {
        const { Haptics } = require("expo-haptics");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (e) {
        // Fallback or ignore
      }
    }
  },
  
  error: () => {
    if (platform.isIOS) {
      try {
        const { Haptics } = require("expo-haptics");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (e) {
        // Fallback or ignore
      }
    }
  },
};

// Safe area helpers
export const safeArea = {
  top: platform.isIOS ? 44 : StatusBar.currentHeight || 24,
  bottom: platform.isIOS ? 34 : 0,
  
  // Get safe area insets (requires react-native-safe-area-context)
  getInsets: () => {
    try {
      const { useSafeAreaInsets } = require("react-native-safe-area-context");
      return useSafeAreaInsets();
    } catch (e) {
      // Fallback values
      return {
        top: safeArea.top,
        bottom: safeArea.bottom,
        left: 0,
        right: 0,
      };
    }
  },
};

// Keyboard utilities
export const keyboard = {
  // Dismiss keyboard
  dismiss: () => {
    try {
      const { Keyboard } = require("react-native");
      Keyboard.dismiss();
    } catch (e) {
      // Ignore if not available
    }
  },
  
  // Add keyboard listeners (requires react-native-keyboard-aware-scroll-view or similar)
  addListener: (event: "keyboardDidShow" | "keyboardDidHide", callback: (e: any) => void) => {
    try {
      const { Keyboard } = require("react-native");
      return Keyboard.addListener(event, callback);
    } catch (e) {
      return { remove: () => {} };
    }
  },
};

// Device orientation
export const orientation = {
  // Get current orientation (requires expo-screen-orientation)
  getCurrent: async () => {
    try {
      const { ScreenOrientation } = require("expo-screen-orientation");
      return await ScreenOrientation.getOrientationAsync();
    } catch (e) {
      return "portrait";
    }
  },
  
  // Lock orientation
  lock: async (orientation: "portrait" | "landscape") => {
    try {
      const { ScreenOrientation } = require("expo-screen-orientation");
      if (orientation === "portrait") {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    } catch (e) {
      // Ignore if not available
    }
  },
  
  // Unlock orientation
  unlock: async () => {
    try {
      const { ScreenOrientation } = require("expo-screen-orientation");
      await ScreenOrientation.unlockAsync();
    } catch (e) {
      // Ignore if not available
    }
  },
};

// Network status (requires @react-native-async-storage/async-storage)
export const network = {
  // Get network state (requires @react-native-community/netinfo)
  getState: async () => {
    try {
      const NetInfo = require("@react-native-community/netinfo");
      return await NetInfo.fetch();
    } catch (e) {
      return { isConnected: true, type: "unknown" };
    }
  },
  
  // Add network listener
  addListener: (callback: (state: any) => void) => {
    try {
      const NetInfo = require("@react-native-community/netinfo");
      return NetInfo.addEventListener(callback);
    } catch (e) {
      return () => {};
    }
  },
};

// App state utilities
export const appState = {
  // Get current app state
  getCurrent: () => {
    try {
      const { AppState } = require("react-native");
      return AppState.currentState;
    } catch (e) {
      return "active";
    }
  },
  
  // Add app state listener
  addListener: (callback: (state: "active" | "background" | "inactive") => void) => {
    try {
      const { AppState } = require("react-native");
      return AppState.addEventListener("change", callback);
    } catch (e) {
      return { remove: () => {} };
    }
  },
};
