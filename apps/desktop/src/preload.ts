import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => process.platform,
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  
  // File operations
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (data: any) => ipcRenderer.invoke('file:save', data),
  
  // Theme
  getTheme: () => ipcRenderer.invoke('theme:get'),
  setTheme: (theme: string) => ipcRenderer.invoke('theme:set', theme),
  
  // Event listeners
  onThemeChanged: (callback: (theme: string) => void) => {
    ipcRenderer.on('theme:changed', (_, theme) => callback(theme));
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Types for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
      getPlatform: () => string;
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      openFile: () => Promise<string | null>;
      saveFile: (data: any) => Promise<boolean>;
      getTheme: () => Promise<string>;
      setTheme: (theme: string) => Promise<void>;
      onThemeChanged: (callback: (theme: string) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
