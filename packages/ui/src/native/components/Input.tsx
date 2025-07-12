import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../utils/styling";

export interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled";
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

const inputSizes = {
  sm: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    minHeight: 32,
    fontSize: typography.fontSize.sm,
  },
  md: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 40,
    fontSize: typography.fontSize.sm,
  },
  lg: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 48,
    fontSize: typography.fontSize.base,
  },
};

const inputVariants = {
  default: {
    backgroundColor: "#ffffff",
    borderColor: colors.gray[300],
    borderWidth: 1,
  },
  filled: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
    borderWidth: 1,
  },
};

export const Input: React.FC<InputProps> = ({
  label,
  description,
  error,
  leftIcon,
  rightIcon,
  variant = "default",
  inputSize = "md",
  fullWidth = false,
  containerStyle,
  inputStyle,
  labelStyle,
  editable = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  const sizeStyle = inputSizes[inputSize];
  const variantStyle = inputVariants[variant];

  const containerStyles: ViewStyle = {
    ...(fullWidth && { width: "100%" }),
    ...containerStyle,
  };

  const inputContainerStyle: ViewStyle = {
    ...styles.inputContainer,
    ...sizeStyle,
    ...variantStyle,
    ...(isFocused && styles.focused),
    ...(hasError && styles.error),
    ...(hasError && variant === "filled" && styles.errorFilled),
    ...(leftIcon && { paddingLeft: spacing[10] }),
    ...(rightIcon && { paddingRight: spacing[10] }),
    ...(!editable && styles.disabled),
  };

  const textInputStyle: TextStyle = {
    ...styles.input,
    fontSize: sizeStyle.fontSize,
    ...inputStyle,
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={[styles.icon, styles.leftIcon]}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={textInputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          placeholderTextColor={colors.gray[400]}
          {...props}
        />
        
        {rightIcon && (
          <View style={[styles.icon, styles.rightIcon]}>
            {rightIcon}
          </View>
        )}
        
        {hasError && !rightIcon && (
          <View style={[styles.icon, styles.rightIcon]}>
            <Text style={styles.errorIcon}>⚠</Text>
          </View>
        )}
      </View>
      
      {description && !error && (
        <Text style={styles.description}>
          {description}
        </Text>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

// Password Input Component
interface PasswordInputProps extends Omit<InputProps, "rightIcon" | "secureTextEntry"> {
  showToggle?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showToggle = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      secureTextEntry={!showPassword}
      rightIcon={
        showToggle ? (
          <TouchableOpacity onPress={togglePassword} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {showPassword ? "👁" : "👁‍🗨"}
            </Text>
          </TouchableOpacity>
        ) : undefined
      }
      {...props}
    />
  );
};

// Search Input Component
interface SearchInputProps extends Omit<InputProps, "leftIcon" | "rightIcon"> {
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onClear,
  showClearButton = true,
  value,
  ...props
}) => {
  const hasValue = value && value.toString().length > 0;

  return (
    <Input
      leftIcon={
        <Text style={styles.searchIcon}>🔍</Text>
      }
      rightIcon={
        showClearButton && hasValue && onClear ? (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        ) : undefined
      }
      value={value}
      {...props}
    />
  );
};

// Textarea Component
interface TextareaProps extends Omit<InputProps, "inputSize"> {
  numberOfLines?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  numberOfLines = 4,
  maxLength,
  showCharacterCount = false,
  value,
  containerStyle,
  ...props
}) => {
  const characterCount = value ? value.toString().length : 0;

  return (
    <View style={containerStyle}>
      <Input
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        inputSize="lg"
        value={value}
        maxLength={maxLength}
        inputStyle={styles.textarea}
        {...props}
      />
      {showCharacterCount && (
        <Text style={styles.characterCount}>
          {characterCount}{maxLength ? `/${maxLength}` : ""}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.md,
    position: "relative",
  },
  
  input: {
    flex: 1,
    color: colors.gray[900],
    fontWeight: typography.fontWeight.normal,
  },
  
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[700],
    marginBottom: spacing[2],
  },
  
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing[2],
  },
  
  icon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  
  leftIcon: {
    left: spacing[3],
  },
  
  rightIcon: {
    right: spacing[3],
  },
  
  focused: {
    borderColor: colors.primary[500],
    borderWidth: 2,
  },
  
  error: {
    borderColor: colors.error[300],
    borderWidth: 1,
  },
  
  errorFilled: {
    backgroundColor: colors.error[50],
  },
  
  disabled: {
    backgroundColor: colors.gray[50],
    opacity: 0.6,
  },
  
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing[2],
    gap: spacing[1],
  },
  
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error[600],
    flex: 1,
  },
  
  errorIcon: {
    fontSize: typography.fontSize.sm,
    color: colors.error[500],
  },
  
  // Password Input styles
  toggleButton: {
    padding: spacing[1],
  },
  
  toggleText: {
    fontSize: typography.fontSize.base,
  },
  
  // Search Input styles
  searchIcon: {
    fontSize: typography.fontSize.base,
    color: colors.gray[400],
  },
  
  clearButton: {
    padding: spacing[1],
  },
  
  clearText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
  },
  
  // Textarea styles
  textarea: {
    textAlignVertical: "top",
    paddingTop: spacing[3],
  },
  
  characterCount: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    textAlign: "right",
    marginTop: spacing[1],
  },
});
