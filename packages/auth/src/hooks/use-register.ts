import { useState } from 'react';
import { AuthService } from '../services/auth-service';
import { useAuthStore } from '@boilerplate/store';
import type { RegisterData, AuthResponse } from '../types';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();
  const authService = new AuthService();

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      
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
        setError(response.error || 'Registration failed');
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
    register,
    isLoading,
    error,
    clearError,
  };
}
