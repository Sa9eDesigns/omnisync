import React from "react";
import { Modal, BottomSheet } from "./Modal";

// Re-export Modal components as Sheet for consistency with web API
export const Sheet = Modal;
export const SheetContent = ({ children, ...props }: any) => children;
export const SheetHeader = ({ children, ...props }: any) => children;
export const SheetTitle = ({ children, ...props }: any) => children;
export const SheetDescription = ({ children, ...props }: any) => children;

// For bottom sheet functionality, use BottomSheet component
export { BottomSheet };
