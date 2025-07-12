import React, { useEffect, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { cn } from "../utils/cn";
import { X } from "lucide-react";
import { Button } from "./Button";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

interface SheetContentProps {
  className?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  onClose?: () => void;
}

const sideClasses = {
  top: {
    container: "inset-x-0 top-0",
    content: "w-full rounded-b-lg",
    animation: "data-[state=open]:animate-slide-in-from-top data-[state=closed]:animate-slide-out-to-top",
  },
  right: {
    container: "inset-y-0 right-0",
    content: "h-full rounded-l-lg",
    animation: "data-[state=open]:animate-slide-in-from-right data-[state=closed]:animate-slide-out-to-right",
  },
  bottom: {
    container: "inset-x-0 bottom-0",
    content: "w-full rounded-t-lg",
    animation: "data-[state=open]:animate-slide-in-from-bottom data-[state=closed]:animate-slide-out-to-bottom",
  },
  left: {
    container: "inset-y-0 left-0",
    content: "h-full rounded-r-lg",
    animation: "data-[state=open]:animate-slide-in-from-left data-[state=closed]:animate-slide-out-to-left",
  },
};

const sizeClasses = {
  sm: {
    top: "max-h-[50vh]",
    right: "max-w-sm",
    bottom: "max-h-[50vh]",
    left: "max-w-sm",
  },
  md: {
    top: "max-h-[60vh]",
    right: "max-w-md",
    bottom: "max-h-[60vh]",
    left: "max-w-md",
  },
  lg: {
    top: "max-h-[75vh]",
    right: "max-w-lg",
    bottom: "max-h-[75vh]",
    left: "max-w-lg",
  },
  xl: {
    top: "max-h-[85vh]",
    right: "max-w-xl",
    bottom: "max-h-[85vh]",
    left: "max-w-xl",
  },
  full: {
    top: "h-full",
    right: "w-full",
    bottom: "h-full",
    left: "w-full",
  },
};

// Hook to detect mobile device
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

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  children,
  side = "right",
  size = "md",
  className,
}) => {
  const isMobile = useIsMobile();
  
  // On mobile, always use bottom sheet for better UX
  const effectiveSide = isMobile && (side === "left" || side === "right") ? "bottom" : side;
  const effectiveSize = isMobile ? "lg" : size;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed z-50 bg-white border shadow-lg",
            "data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out",
            sideClasses[effectiveSide].container,
            sideClasses[effectiveSide].content,
            sizeClasses[effectiveSize][effectiveSide],
            "dark:bg-gray-900 dark:border-gray-800",
            className
          )}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const SheetContent: React.FC<SheetContentProps> = ({
  className,
  children,
  side = "right",
  showCloseButton = true,
  onClose,
}) => {
  const isMobile = useIsMobile();
  const effectiveSide = isMobile && (side === "left" || side === "right") ? "bottom" : side;

  return (
    <div
      className={cn(
        "omnisync-component flex flex-col h-full",
        className
      )}
    >
      {/* Mobile drag indicator for bottom sheets */}
      {isMobile && effectiveSide === "bottom" && (
        <div className="flex justify-center py-2">
          <div className="w-8 h-1 bg-gray-300 rounded-full dark:bg-gray-600" />
        </div>
      )}
      
      {/* Close button */}
      {showCloseButton && (
        <div className={cn(
          "flex justify-end p-4",
          effectiveSide === "bottom" && isMobile && "pt-2"
        )}>
          <Dialog.Close>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<X className="h-4 w-4" />}
              onClick={onClose}
              className="h-8 w-8 p-0"
            />
          </Dialog.Close>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {children}
      </div>
    </div>
  );
};

export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left mb-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <Dialog.Title
    className={cn(
      "text-lg font-semibold text-gray-900 dark:text-gray-100",
      "sm:text-xl",
      className
    )}
    {...props}
  >
    {children}
  </Dialog.Title>
);

export const SheetDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <Dialog.Description
    className={cn(
      "text-sm text-gray-600 dark:text-gray-400",
      "sm:text-base",
      className
    )}
    {...props}
  >
    {children}
  </Dialog.Description>
);

export const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      "gap-2 pt-4 border-t border-gray-200 dark:border-gray-700",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Responsive Sheet Hook - automatically chooses Dialog on desktop, Sheet on mobile
export const useResponsiveSheet = () => {
  const isMobile = useIsMobile();
  
  return {
    isMobile,
    Component: isMobile ? Sheet : Dialog,
    side: isMobile ? "bottom" : "right",
  };
};
