import { useAuthStore } from '../stores/auth-store';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    login,
    logout,
    clearError,
  } = useAuthStore();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    clearError,
    
    // Internal actions (for advanced use cases)
    setUser,
    setLoading,
    setError,
  };
};

export default useAuth;
