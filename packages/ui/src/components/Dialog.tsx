import React from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { cn } from "../utils/cn";
import { X } from "lucide-react";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const DialogComponent: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  className,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
            "data-[state=open]:animate-fade-in"
          )}
        />
        <Dialog.Popup
          className={cn(
            "omnisync-component fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "bg-white rounded-lg shadow-xl border border-gray-200",
            "w-full mx-4",
            sizeClasses[size],
            "data-[state=open]:animate-slide-in",
            className
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-gray-600 mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            {showCloseButton && (
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<X className="h-4 w-4" />}
                  className="ml-4"
                />
              </Dialog.Close>
            )}
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// Convenience components for common dialog patterns
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  loading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <DialogComponent
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      showCloseButton={false}
    >
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "destructive" ? "destructive" : "primary"}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </DialogComponent>
  );
};

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = "OK",
  onAction,
}) => {
  const handleAction = () => {
    onAction?.();
    onOpenChange(false);
  };

  return (
    <DialogComponent
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      showCloseButton={false}
    >
      <div className="flex justify-end">
        <Button onClick={handleAction}>
          {actionLabel}
        </Button>
      </div>
    </DialogComponent>
  );
};
