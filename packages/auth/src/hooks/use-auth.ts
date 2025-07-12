import { useAuthStore } from '@boilerplate/store';
import { AuthService } from '../services/auth-service';
import type { AuthContextType } from '../types';

export function useAuth(): AuthContextType {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const authService = new AuthService();

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user && response.token) {
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
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      
      if (response.success && response.user && response.token) {
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
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    
    // Clear stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
    }
  };

  const forgotPassword = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(data);
      
      if (!response.success) {
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
      setLoading(false);
    }
  };

  const resetPassword = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.resetPassword(data);
      
      if (!response.success) {
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
      setLoading(false);
    }
  };

  const changePassword = async (data: any) => {
    if (!user) {
      const error = 'User not authenticated';
      setError(error);
      return {
        success: false,
        error,
      };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.changePassword(user.id, data);
      
      if (!response.success) {
        setError(response.error || 'Failed to change password');
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
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh-token') 
      : null;

    if (!refreshToken) {
      logout();
      return;
    }

    setLoading(true);

    try {
      const response = await authService.refreshToken(refreshToken);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        
        // Update stored token
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', response.token);
        }
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token: typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null,
    refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refresh-token') : null,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshAuth,
    clearError,
  };
}
