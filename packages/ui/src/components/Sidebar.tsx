import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Sheet } from "./Sheet";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarContextValue {
  isOpen: boolean;
  isMobile: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen = false,
  defaultCollapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      
      // Auto-close on mobile when switching from desktop
      if (mobile && isOpen) {
        setIsOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isMobile,
        isCollapsed,
        toggle,
        open,
        close,
        toggleCollapse,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className,
  collapsible = true,
}) => {
  const { isOpen, isMobile, isCollapsed, close } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()} side="left" size="sm">
        <div className={cn("h-full bg-white dark:bg-gray-900", className)}>
          {children}
        </div>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "omnisync-component fixed left-0 top-0 z-40 h-screen transition-all duration-300",
        "bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800",
        isCollapsed ? "w-16" : "w-64",
        "hidden lg:block",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Collapse toggle */}
        {collapsible && (
          <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-800">
            <SidebarCollapseToggle />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </aside>
  );
};

export const SidebarTrigger: React.FC<{
  className?: string;
  variant?: "secondary" | "ghost" | "outline";
}> = ({ className, variant = "ghost" }) => {
  const { toggle, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={toggle}
      leftIcon={<Menu className="h-4 w-4" />}
      className={className}
    />
  );
};

export const SidebarCollapseToggle: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { isCollapsed, toggleCollapse, isMobile } = useSidebar();

  if (isMobile) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCollapse}
      leftIcon={
        isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )
      }
      className={cn("h-8 w-8 p-0", className)}
    />
  );
};

export const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4",
        isCollapsed && !isMobile && "px-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div
      className={cn(
        "px-4 py-6 border-b border-gray-200 dark:border-gray-800",
        isCollapsed && !isMobile && "px-2 text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div
      className={cn(
        "px-4 py-4 border-t border-gray-200 dark:border-gray-800 mt-auto",
        isCollapsed && !isMobile && "px-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  children,
  className,
}) => (
  <nav className={cn("space-y-1", className)}>
    {children}
  </nav>
);

interface SidebarMenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: string | number;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  children,
  icon,
  active = false,
  disabled = false,
  onClick,
  className,
  badge,
}) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        active && "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
        disabled && "opacity-50 cursor-not-allowed",
        isCollapsed && !isMobile && "justify-center px-2",
        className
      )}
    >
      {icon && (
        <span className="flex-shrink-0 w-5 h-5">
          {icon}
        </span>
      )}
      
      {(!isCollapsed || isMobile) && (
        <>
          <span className="flex-1 text-left truncate">
            {children}
          </span>
          {badge && (
            <span className="flex-shrink-0 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
};

interface SidebarMenuGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({
  label,
  children,
  className,
}) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className={cn("space-y-2", className)}>
      {(!isCollapsed || isMobile) && (
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
          {label}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

// Layout component that handles sidebar spacing
interface SidebarLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  className,
}) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-300",
        !isMobile && (isCollapsed ? "lg:pl-16" : "lg:pl-64"),
        className
      )}
    >
      {children}
    </div>
  );
};
