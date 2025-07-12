import { useState } from 'react';
import { AuthService } from '../services/auth-service';
import type { ResetPasswordData, AuthResponse } from '../types';

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const authService = new AuthService();

  const resetPassword = async (data: ResetPasswordData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authService.resetPassword(data);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || 'Failed to reset password');
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
    resetPassword,
    isLoading,
    error,
    success,
    clearError,
    reset,
  };
}
