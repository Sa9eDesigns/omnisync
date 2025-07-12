import { clsx, type ClassValue } from "clsx";

/**
 * Utility function to merge class names
 * Similar to shadcn/ui's cn utility
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
