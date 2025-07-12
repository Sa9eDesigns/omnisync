import React, { useState, useEffect } from "react";
import { cn } from "../utils/cn";
import { SidebarProvider, SidebarTrigger, useSidebar } from "./Sidebar";
import { Button } from "./Button";
import { Menu, Bell, Search, User, Settings } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showSidebarToggle?: boolean;
}

interface MainProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg";
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
  };
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

// Root Layout Component
export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      {children}
    </div>
  );
};

// Header Component
export const Header: React.FC<HeaderProps> = ({
  children,
  className,
  title,
  subtitle,
  actions,
  showSidebarToggle = true,
}) => {
  const isMobile = useIsMobile();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800",
        className
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {showSidebarToggle && <SidebarTrigger />}
            
            {(title || subtitle) && (
              <div className="hidden sm:block">
                {title && (
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Center - Custom content */}
          {children && (
            <div className="flex-1 flex justify-center px-4">
              {children}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
};

// Main Content Area
export const Main: React.FC<MainProps> = ({
  children,
  className,
  padding = "md",
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-4 sm:p-6 lg:p-8",
    lg: "p-6 sm:p-8 lg:p-12",
  };

  return (
    <main className={cn("flex-1", paddingClasses[padding], className)}>
      {children}
    </main>
  );
};

// Container Component
export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = "lg",
}) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1400px]",
    full: "max-w-none",
  };

  return (
    <div className={cn("container mx-auto", sizeClasses[size], className)}>
      {children}
    </div>
  );
};

// Grid System
export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 1,
  gap = "md",
  responsive,
}) => {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };

  return (
    <div
      className={cn(
        "grid",
        gapClasses[gap],
        colClasses[cols],
        responsive?.sm && `sm:${colClasses[responsive.sm]}`,
        responsive?.md && `md:${colClasses[responsive.md]}`,
        responsive?.lg && `lg:${colClasses[responsive.lg]}`,
        className
      )}
    >
      {children}
    </div>
  );
};

// Stack Component (Vertical Layout)
interface StackProps {
  children: React.ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
}

export const Stack: React.FC<StackProps> = ({
  children,
  className,
  gap = "md",
  align = "stretch",
}) => {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        gapClasses[gap],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};

// Inline Component (Horizontal Layout)
interface InlineProps {
  children: React.ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

export const Inline: React.FC<InlineProps> = ({
  children,
  className,
  gap = "md",
  align = "center",
  justify = "start",
  wrap = false,
}) => {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    baseline: "items-baseline",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <div
      className={cn(
        "flex",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  );
};

// Page Layout - Combines common patterns
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
  containerSize?: ContainerProps["size"];
  padding?: MainProps["padding"];
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
  containerSize = "lg",
  padding = "md",
}) => {
  return (
    <Layout className={className}>
      <Header title={title} subtitle={subtitle} actions={actions} />
      <Main padding={padding}>
        <Container size={containerSize}>
          {breadcrumbs && (
            <div className="mb-6">
              {breadcrumbs}
            </div>
          )}
          {children}
        </Container>
      </Main>
    </Layout>
  );
};

// App Shell - Complete application layout
interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebar,
  header,
  footer,
  className,
}) => {
  return (
    <SidebarProvider>
      <Layout className={className}>
        <div className="flex h-screen">
          {sidebar}
          <div className="flex-1 flex flex-col overflow-hidden">
            {header}
            <Main padding="none" className="flex-1 overflow-auto">
              {children}
            </Main>
            {footer}
          </div>
        </div>
      </Layout>
    </SidebarProvider>
  );
};

// Responsive Breakpoint Hook
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"sm" | "md" | "lg" | "xl" | "2xl">("lg");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("sm");
      else if (width < 768) setBreakpoint("md");
      else if (width < 1024) setBreakpoint("lg");
      else if (width < 1280) setBreakpoint("xl");
      else setBreakpoint("2xl");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop: ["lg", "xl", "2xl"].includes(breakpoint),
  };
};
