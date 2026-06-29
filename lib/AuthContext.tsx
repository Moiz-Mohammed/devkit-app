'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { tokenStorage } from '@/lib/auth';
import type { User, SignupInput, LoginInput } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupInput) => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ─── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      const token = tokenStorage.getAccess();
      if (!token) { setIsLoading(false); return; }
      try {
        const { data } = await authApi.me();
        setUser(data.user);
      } catch {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const signup = async (input: SignupInput) => {
    const { data } = await authApi.signup(input);
    tokenStorage.set(data.accessToken, data.refreshToken);
    setUser(data.user);
    // New users go to onboarding
    router.push('/onboarding');
  };

  const login = async (input: LoginInput) => {
    const { data } = await authApi.login(input);
    tokenStorage.set(data.accessToken, data.refreshToken);
    setUser(data.user);
    // Redirect based on whether they've completed onboarding
    if (!data.user.character) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    tokenStorage.clear();
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const { data } = await authApi.me();
      setUser(data.user);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, signup, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
