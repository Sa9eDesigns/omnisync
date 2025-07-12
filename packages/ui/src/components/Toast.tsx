import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "@base-ui-components/react/toast";
import { cn } from "../utils/cn";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      duration: 5000,
      type: "info",
      ...toast,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const getToastConfig = (type: ToastData["type"]) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          className: "bg-green-50 border-green-200 text-green-800",
          iconClassName: "text-green-600",
        };
      case "error":
        return {
          icon: AlertCircle,
          className: "bg-red-50 border-red-200 text-red-800",
          iconClassName: "text-red-600",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          className: "bg-yellow-50 border-yellow-200 text-yellow-800",
          iconClassName: "text-yellow-600",
        };
      case "info":
      default:
        return {
          icon: Info,
          className: "bg-blue-50 border-blue-200 text-blue-800",
          iconClassName: "text-blue-600",
        };
    }
  };

  const config = getToastConfig(toast.type);
  const Icon = config.icon;

  return (
    <Toast.Root
      className={cn(
        "omnisync-component relative flex items-start gap-3 p-4 rounded-lg border shadow-lg",
        "animate-slide-in",
        config.className
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClassName)} />
      
      <div className="flex-1 min-w-0">
        <Toast.Title className="text-sm font-semibold">
          {toast.title}
        </Toast.Title>
        
        {toast.description && (
          <Toast.Description className="text-sm mt-1 opacity-90">
            {toast.description}
          </Toast.Description>
        )}
        
        {toast.action && (
          <div className="mt-3">
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>
      
      <Toast.Close asChild>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
        >
          <X className="h-4 w-4" />
        </button>
      </Toast.Close>
    </Toast.Root>
  );
};
