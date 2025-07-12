import React from "react";
import { cn } from "../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  loading?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
}

const cardVariants = {
  default: [
    "bg-white border border-gray-200 shadow-sm",
    "dark:bg-gray-900 dark:border-gray-800",
  ],
  outline: [
    "bg-transparent border-2 border-gray-200",
    "dark:border-gray-700",
  ],
  ghost: [
    "bg-gray-50 border-0",
    "dark:bg-gray-800",
  ],
};

const cardSizes = {
  sm: "p-3",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      interactive = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "omnisync-component rounded-lg transition-all duration-200",
          
          // Variant styles
          cardVariants[variant],
          
          // Size styles
          cardSizes[size],
          
          // Interactive styles
          interactive && [
            "cursor-pointer hover:shadow-md hover:scale-[1.02]",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "active:scale-[0.98]",
          ],
          
          // Loading state
          loading && "animate-pulse pointer-events-none",
          
          className
        )}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0",
          "pb-4 border-b border-gray-100 dark:border-gray-800",
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">{children}</div>
        {actions && (
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100",
      "sm:text-xl",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-gray-600 dark:text-gray-400 mt-1",
      "sm:text-base",
      className
    )}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = "md", children, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "pt-3",
      md: "pt-4",
      lg: "pt-6",
    };

    return (
      <div
        ref={ref}
        className={cn(paddingClasses[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, justify = "end", children, ...props }, ref) => {
    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800",
          "flex-col sm:flex-row",
          justifyClasses[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

// Skeleton Card for loading states
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card loading className={cn("space-y-4", className)}>
    <CardHeader>
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4 dark:bg-gray-700" />
        <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700" />
        <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-gray-700" />
        <div className="h-4 bg-gray-200 rounded w-4/6 dark:bg-gray-700" />
      </div>
    </CardContent>
    <CardFooter>
      <div className="h-8 bg-gray-200 rounded w-20 dark:bg-gray-700" />
      <div className="h-8 bg-gray-200 rounded w-24 dark:bg-gray-700" />
    </CardFooter>
  </Card>
);

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
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
}) => (
  <Card className={cn("relative overflow-hidden", className)}>
    <CardContent padding="md">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 sm:text-3xl">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 sm:text-sm">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium sm:text-sm",
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1 sm:text-sm">
                from last period
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-8 h-8 text-gray-400 dark:text-gray-500 sm:w-10 sm:h-10">
              {icon}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
