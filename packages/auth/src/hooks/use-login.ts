import { useState } from 'react';
import { AuthService } from '../services/auth-service';
import { useAuthStore } from '@boilerplate/store';
import type { LoginCredentials, AuthResponse } from '../types';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();
  const authService = new AuthService();

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user && response.token) {
        // Store user and token in auth store
        setUser(response.user);
        
        // Store token in secure storage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', response.token);
          if (response.refreshToken) {
            localStorage.setItem('refresh-token', response.refreshToken);
          }
        }
      } else {
        setError(response.error || 'Login failed');
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    isLoading,
    error,
    clearError,
  };
}
