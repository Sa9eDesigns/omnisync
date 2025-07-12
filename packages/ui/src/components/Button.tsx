import React from "react";
import { cn } from "../utils/cn";
import { Loader2 } from "lucide-react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, StyledProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: [
    "bg-blue-600 text-white border-blue-600",
    "hover:bg-blue-700 hover:border-blue-700",
    "active:bg-blue-800 active:border-blue-800",
    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    "disabled:bg-blue-300 disabled:border-blue-300 disabled:cursor-not-allowed",
  ],
  secondary: [
    "bg-gray-600 text-white border-gray-600",
    "hover:bg-gray-700 hover:border-gray-700",
    "active:bg-gray-800 active:border-gray-800",
    "focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
    "disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed",
  ],
  outline: [
    "bg-transparent text-gray-700 border-gray-300",
    "hover:bg-gray-50 hover:text-gray-900",
    "active:bg-gray-100",
    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    "disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed",
  ],
  ghost: [
    "bg-transparent text-gray-700 border-transparent",
    "hover:bg-gray-100 hover:text-gray-900",
    "active:bg-gray-200",
    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    "disabled:text-gray-400 disabled:cursor-not-allowed",
  ],
  destructive: [
    "bg-red-600 text-white border-red-600",
    "hover:bg-red-700 hover:border-red-700",
    "active:bg-red-800 active:border-red-800",
    "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    "disabled:bg-red-300 disabled:border-red-300 disabled:cursor-not-allowed",
  ],
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm h-8",
  md: "px-4 py-2 text-sm h-10",
  lg: "px-6 py-3 text-base h-12",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "omnisync-component inline-flex items-center justify-center gap-2",
          "font-medium rounded-md border transition-all duration-200",
          "focus:outline-none focus:ring-offset-white",
          
          // Variant styles
          buttonVariants[variant],
          
          // Size styles
          buttonSizes[size],
          
          // Full width
          fullWidth && "w-full",
          
          // Loading state
          loading && "relative",
          
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        {!loading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        
        {children && (
          <span className={loading ? "opacity-0" : ""}>{children}</span>
        )}
        
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
