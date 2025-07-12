// UI Components for OmniSync built with Base UI - Mobile First Design

// Core Components (Working)
export * from "./components/Button";
export * from "./components/Input";
export * from "./components/Card";
export * from "./components/Badge";

// Layout Components (Working)
export * from "./components/Layout";

// Hooks (Working)
export * from "./hooks/useAudioStream";
export * from "./hooks/useWebRTC";

// Utilities
export * from "./utils/cn";

// Universal Cross-Platform UI System (NEW)
// Inspired by Tamagui - works across Web, React Native, and Electron
export * from "./universal";

// Legacy Components (for backward compatibility)
export { Button as LegacyButton } from "./components/Button";
export { InputComponent as LegacyInput } from "./components/Input";
export { Card as LegacyCard } from "./components/Card";

// Note: Import "./styles/base.css" in your app to use the base styles

// Temporarily disabled components due to Base UI API compatibility issues:
// - Dialog, Toast, Sheet, Table, Tabs
// - Sidebar
// - AudioControls, DeviceSelector, MetricsDisplay, AudioControlPanel, ConnectionStatus
// - ComponentShowcase
// These will be re-enabled once API compatibility is resolved
