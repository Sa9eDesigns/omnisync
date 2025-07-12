import React from "react";
import { Input } from "@base-ui-components/react/input";
import { Field } from "@base-ui-components/react/field";
import { cn } from "../utils/cn";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled";
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const inputSizes = {
  sm: "px-3 py-1.5 text-sm h-8",
  md: "px-3 py-2 text-sm h-10",
  lg: "px-4 py-3 text-base h-12",
};

export const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      variant = "default",
      inputSize = "md",
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <Input
          ref={ref}
          className={cn(
            // Base styles
            "omnisync-component w-full border rounded-md transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            
            // Size styles
            inputSizes[inputSize],
            
            // Icon padding
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            
            // Variant styles
            variant === "default" && [
              "bg-white border-gray-300",
              "hover:border-gray-400",
            ],
            variant === "filled" && [
              "bg-gray-50 border-gray-200",
              "hover:bg-gray-100 hover:border-gray-300",
            ],
            
            // Error styles
            hasError && [
              "border-red-300 focus:border-red-500 focus:ring-red-500",
              variant === "filled" && "bg-red-50",
            ],
            
            // Full width
            fullWidth && "w-full",
            
            className
          )}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {hasError && !rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle className="h-4 w-4" />
          </div>
        )}
      </div>
    );

    if (label || description || error) {
      return (
        <Field.Root className={cn("space-y-2", fullWidth && "w-full")}>
          {label && (
            <Field.Label className="text-sm font-medium text-gray-700">
              {label}
            </Field.Label>
          )}
          
          {inputElement}
          
          {description && !error && (
            <Field.Description className="text-sm text-gray-600">
              {description}
            </Field.Description>
          )}
          
          {error && (
            <Field.Error className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </Field.Error>
          )}
        </Field.Root>
      );
    }

    return inputElement;
  }
);

InputComponent.displayName = "Input";

// Password Input Component
interface PasswordInputProps extends Omit<InputProps, "type" | "rightIcon"> {
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <InputComponent
        ref={ref}
        type={showPassword ? "text" : "password"}
        rightIcon={
          showToggle ? (
            <button
              type="button"
              onClick={togglePassword}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

// Search Input Component
interface SearchInputProps extends Omit<InputProps, "type" | "leftIcon"> {
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, value, ...props }, ref) => {
    const hasValue = value && value.toString().length > 0;

    return (
      <InputComponent
        ref={ref}
        type="search"
        leftIcon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        rightIcon={
          showClearButton && hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : undefined
        }
        value={value}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
