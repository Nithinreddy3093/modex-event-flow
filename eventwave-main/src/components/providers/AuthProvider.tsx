'use client';

import { AuthContext } from '@/contexts/AuthContext';
import type { User, AuthPayload } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

const USER_STORAGE_KEY = 'gtp_user';
const ACCESS_TOKEN_STORAGE_KEY = 'gtp_access';
const REFRESH_TOKEN_STORAGE_KEY = 'gtp_refresh';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    setUser(null);
    setAccessToken(null);
    api.setToken(null);
  }, []);

  const setTokens = useCallback(({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    setAccessToken(accessToken);
    api.setToken(accessToken);
  }, []);

  useEffect(() => {
    api.init(logout, setTokens);
  }, [logout, setTokens]);

  const loadAuthFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

      if (storedUser && storedToken && storedRefreshToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
        api.setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to load auth from storage', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  const login = (payload: AuthPayload) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload.user));
    setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
    setUser(payload.user);
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    logout,
    setTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
