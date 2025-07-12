import { useState } from 'react';
import { AuthService } from '../services/auth-service';
import type { ForgotPasswordData, AuthResponse } from '../types';

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const authService = new AuthService();

  const forgotPassword = async (data: ForgotPasswordData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authService.forgotPassword(data);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || 'Failed to send reset email');
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
  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    forgotPassword,
    isLoading,
    error,
    success,
    clearError,
    reset,
  };
}
