import React, { useState, useEffect, createContext, useContext } from "react";
import { Tabs } from "@base-ui-components/react/tabs";
import { cn } from "../utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface TabsContextValue {
  isMobile: boolean;
  scrollable: boolean;
}

const TabsContext = createContext<TabsContextValue>({ isMobile: false, scrollable: false });

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  scrollable?: boolean;
  fullWidth?: boolean;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

const tabVariants = {
  default: {
    list: "bg-gray-100 p-1 rounded-lg dark:bg-gray-800",
    trigger: [
      "data-[state=active]:bg-white data-[state=active]:shadow-sm",
      "dark:data-[state=active]:bg-gray-900",
    ],
  },
  pills: {
    list: "bg-transparent",
    trigger: [
      "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700",
      "dark:data-[state=active]:bg-blue-900/50 dark:data-[state=active]:text-blue-300",
    ],
  },
  underline: {
    list: "border-b border-gray-200 dark:border-gray-700",
    trigger: [
      "border-b-2 border-transparent data-[state=active]:border-blue-500",
      "data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400",
      "rounded-none",
    ],
  },
};

const tabSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const TabsRoot: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  orientation = "horizontal",
  variant = "default",
  size = "md",
  scrollable = false,
  fullWidth = false,
}) => {
  const isMobile = useIsMobile();
  const effectiveScrollable = scrollable || isMobile;

  return (
    <TabsContext.Provider value={{ isMobile, scrollable: effectiveScrollable }}>
      <Tabs.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        orientation={orientation}
        className={cn(
          "omnisync-component",
          orientation === "vertical" && "flex gap-4",
          className
        )}
        data-variant={variant}
        data-size={size}
        data-full-width={fullWidth}
      >
        {children}
      </Tabs.Root>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  const { isMobile, scrollable } = useContext(TabsContext);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    if (scrollable) {
      checkScroll();
      const element = scrollRef.current;
      element?.addEventListener("scroll", checkScroll);
      return () => element?.removeEventListener("scroll", checkScroll);
    }
  }, [scrollable]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 200;
    const newScrollLeft = scrollRef.current.scrollLeft + 
      (direction === "left" ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {scrollable && canScrollLeft && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white shadow-md dark:bg-gray-900"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Tabs.List
        ref={scrollRef}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400",
          scrollable && [
            "overflow-x-auto scrollbar-hide",
            "px-8", // Space for scroll buttons
          ],
          !scrollable && "w-full",
          // Get variant styles from CSS custom properties or data attributes
          "[&[data-variant=default]]:bg-gray-100 [&[data-variant=default]]:p-1 [&[data-variant=default]]:dark:bg-gray-800",
          "[&[data-variant=underline]]:border-b [&[data-variant=underline]]:border-gray-200 [&[data-variant=underline]]:dark:border-gray-700",
          className
        )}
      >
        {children}
      </Tabs.List>
      
      {scrollable && canScrollRight && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white shadow-md dark:bg-gray-900"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  disabled = false,
  icon,
  badge,
}) => {
  const { isMobile } = useContext(TabsContext);

  return (
    <Tabs.Trigger
      value={value}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "hover:text-gray-900 dark:hover:text-gray-100",
        
        // Size classes
        "[&[data-size=sm]]:px-3 [&[data-size=sm]]:py-1.5 [&[data-size=sm]]:text-sm",
        "[&[data-size=md]]:px-4 [&[data-size=md]]:py-2 [&[data-size=md]]:text-sm",
        "[&[data-size=lg]]:px-6 [&[data-size=lg]]:py-3 [&[data-size=lg]]:text-base",
        
        // Variant classes
        "[&[data-variant=default]]:data-[state=active]:bg-white [&[data-variant=default]]:data-[state=active]:shadow-sm",
        "[&[data-variant=default]]:dark:data-[state=active]:bg-gray-900",
        
        "[&[data-variant=pills]]:data-[state=active]:bg-blue-100 [&[data-variant=pills]]:data-[state=active]:text-blue-700",
        "[&[data-variant=pills]]:dark:data-[state=active]:bg-blue-900/50 [&[data-variant=pills]]:dark:data-[state=active]:text-blue-300",
        
        "[&[data-variant=underline]]:border-b-2 [&[data-variant=underline]]:border-transparent",
        "[&[data-variant=underline]]:data-[state=active]:border-blue-500 [&[data-variant=underline]]:rounded-none",
        "[&[data-variant=underline]]:data-[state=active]:text-blue-600 [&[data-variant=underline]]:dark:data-[state=active]:text-blue-400",
        
        // Full width
        "[&[data-full-width=true]]:flex-1",
        
        // Mobile adjustments
        isMobile && "min-w-0 flex-shrink-0",
        
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className="flex-shrink-0">
            {React.cloneElement(icon as React.ReactElement, {
              className: cn("h-4 w-4", (icon as React.ReactElement).props?.className),
            })}
          </span>
        )}
        
        <span className={cn(isMobile && "truncate")}>{children}</span>
        
        {badge && (
          <span className="flex-shrink-0 bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {badge}
          </span>
        )}
      </div>
    </Tabs.Trigger>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
}) => {
  return (
    <Tabs.Content
      value={value}
      className={cn(
        "mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "dark:ring-offset-gray-950",
        "data-[state=active]:animate-fade-in",
        className
      )}
    >
      {children}
    </Tabs.Content>
  );
};

// Convenience component that combines all parts
interface SimpleTabsProps {
  tabs: Array<{
    value: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    badge?: string | number;
    disabled?: boolean;
  }>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
  scrollable?: boolean;
  fullWidth?: boolean;
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  variant = "default",
  size = "md",
  className,
  scrollable = false,
  fullWidth = false,
}) => {
  return (
    <TabsRoot
      defaultValue={defaultValue || tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      variant={variant}
      size={size}
      scrollable={scrollable}
      fullWidth={fullWidth}
      className={className}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            icon={tab.icon}
            badge={tab.badge}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
};

// Export individual components with better names
export const Tabs = TabsRoot;
export { TabsList, TabsTrigger, TabsContent };
