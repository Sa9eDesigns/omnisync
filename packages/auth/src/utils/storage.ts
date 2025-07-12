// Cross-platform secure storage utilities

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
const isWeb = typeof window !== 'undefined' && !isReactNative;

// Storage interface
export interface SecureStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Web storage implementation
class WebStorage implements SecureStorage {
  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to store item:', error);
      throw new Error('Failed to store item');
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw new Error('Failed to remove item');
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw new Error('Failed to clear storage');
    }
  }
}

// React Native storage implementation
class ReactNativeStorage implements SecureStorage {
  private SecureStore: any;

  constructor() {
    if (isReactNative) {
      try {
        // Dynamically import SecureStore for React Native
        this.SecureStore = require('expo-secure-store');
      } catch (error) {
        console.warn('expo-secure-store not available, falling back to AsyncStorage');
        try {
          this.SecureStore = require('@react-native-async-storage/async-storage').default;
        } catch (asyncError) {
          console.error('No storage solution available');
          throw new Error('No secure storage available');
        }
      }
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.SecureStore.setItemAsync) {
        // expo-secure-store
        await this.SecureStore.setItemAsync(key, value);
      } else {
        // AsyncStorage
        await this.SecureStore.setItem(key, value);
      }
    } catch (error) {
      console.error('Failed to store item:', error);
      throw new Error('Failed to store item');
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.SecureStore.getItemAsync) {
        // expo-secure-store
        return await this.SecureStore.getItemAsync(key);
      } else {
        // AsyncStorage
        return await this.SecureStore.getItem(key);
      }
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (this.SecureStore.deleteItemAsync) {
        // expo-secure-store
        await this.SecureStore.deleteItemAsync(key);
      } else {
        // AsyncStorage
        await this.SecureStore.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw new Error('Failed to remove item');
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.SecureStore.clear) {
        await this.SecureStore.clear();
      } else {
        // For expo-secure-store, we need to manually track and remove keys
        console.warn('Clear operation not supported by expo-secure-store');
      }
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw new Error('Failed to clear storage');
    }
  }
}

// Create platform-specific storage instance
export const secureStorage: SecureStorage = isReactNative 
  ? new ReactNativeStorage() 
  : new WebStorage();

// Auth-specific storage keys
export const AUTH_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_DATA: 'auth_user_data',
  REMEMBER_ME: 'auth_remember_me',
  BIOMETRIC_ENABLED: 'auth_biometric_enabled',
} as const;

// Auth storage utilities
export class AuthStorage {
  static async setAccessToken(token: string): Promise<void> {
    await secureStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, token);
  }

  static async getAccessToken(): Promise<string | null> {
    return await secureStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
  }

  static async setRefreshToken(token: string): Promise<void> {
    await secureStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return await secureStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
  }

  static async setUserData(userData: any): Promise<void> {
    await secureStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData));
  }

  static async getUserData(): Promise<any | null> {
    const data = await secureStorage.getItem(AUTH_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  static async setRememberMe(remember: boolean): Promise<void> {
    await secureStorage.setItem(AUTH_KEYS.REMEMBER_ME, remember.toString());
  }

  static async getRememberMe(): Promise<boolean> {
    const remember = await secureStorage.getItem(AUTH_KEYS.REMEMBER_ME);
    return remember === 'true';
  }

  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    await secureStorage.setItem(AUTH_KEYS.BIOMETRIC_ENABLED, enabled.toString());
  }

  static async getBiometricEnabled(): Promise<boolean> {
    const enabled = await secureStorage.getItem(AUTH_KEYS.BIOMETRIC_ENABLED);
    return enabled === 'true';
  }

  static async clearAuthData(): Promise<void> {
    await Promise.all([
      secureStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN),
      secureStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN),
      secureStorage.removeItem(AUTH_KEYS.USER_DATA),
      secureStorage.removeItem(AUTH_KEYS.REMEMBER_ME),
    ]);
  }

  static async clearAllData(): Promise<void> {
    await secureStorage.clear();
  }
}

// Session storage utilities (for temporary data)
export class SessionStorage {
  static setItem(key: string, value: string): void {
    if (isWeb && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  }

  static getItem(key: string): string | null {
    if (isWeb && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  static removeItem(key: string): void {
    if (isWeb && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  }

  static clear(): void {
    if (isWeb && typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  }
}

export default secureStorage;
