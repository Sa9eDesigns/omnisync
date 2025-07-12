import { useAuthStore } from '@boilerplate/store';

export function useLogout() {
  const { setUser } = useAuthStore();

  const logout = () => {
    // Clear user from store
    setUser(null);
    
    // Clear stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
    }
    
    // In React Native, you might want to clear from secure storage
    // Example: await SecureStore.deleteItemAsync('auth-token');
  };

  return {
    logout,
  };
}
