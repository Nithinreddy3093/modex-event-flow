'use client';

import type { User, AuthPayload } from '@/lib/types';
import { createContext, useContext } from 'react';

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: AuthPayload) => void;
  logout: () => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
