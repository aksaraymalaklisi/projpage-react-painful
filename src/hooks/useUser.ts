import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

/**
 * Custom hook for managing user authentication state
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync user state from localStorage
  useEffect(() => {
    const syncUser = () => {
      const saved = localStorage.getItem('user');
      setUser(saved ? JSON.parse(saved) : null);
    };

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', syncUser);
    // Listen for custom userChanged events
    window.addEventListener('userChanged', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('userChanged', syncUser);
    };
  }, []);

  // Update user in state and localStorage
  const updateUser = useCallback((userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
    window.dispatchEvent(new Event('userChanged'));
  }, []);

  // Fetch user profile from API
  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      updateUser(null);
      return;
    }

    setIsLoading(true);
    try {
      const userData = await api.get<User>('users/me/', true);
      const userProfile: User = {
        id: userData.id || userData.username,
        username: userData.username,
        email: userData.email,
        name: userData.name || userData.profile?.name || userData.username,
        phone: userData.phone,
        profile: userData.profile,
      };
      updateUser(userProfile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      updateUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  // Logout function
  const logout = useCallback(() => {
    api.clearTokens();
    updateUser(null);
  }, [updateUser]);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  return {
    user,
    isLoading,
    isAuthenticated,
    updateUser,
    fetchUserProfile,
    logout,
  };
}

