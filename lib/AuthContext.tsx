'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { tokenStorage } from '@/lib/auth';
import { demoStorage, DEMO_USER } from '@/lib/demo';
import type { User, SignupInput, LoginInput } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  signup: (data: SignupInput) => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ─── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      // 1. Check Demo Mode first
      if (demoStorage.isDemoActive()) {
        const demoUser = demoStorage.getDemoUser() || DEMO_USER;
        setUser(demoUser);
        setIsDemo(true);
        setIsLoading(false);
        return;
      }

      // 2. Check Real JWT Token
      const token = tokenStorage.getAccess();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await authApi.me();
        setUser(data.user);
        setIsDemo(false);
      } catch {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, []);

  const signup = async (input: SignupInput) => {
    // Clear any prior demo state on real signup
    demoStorage.clearDemo();
    setIsDemo(false);

    const { data } = await authApi.signup(input);
    tokenStorage.set(data.accessToken, data.refreshToken);
    setUser(data.user);
    router.push('/onboarding');
  };

  const login = async (input: LoginInput) => {
    // Clear any prior demo state on real login
    demoStorage.clearDemo();
    setIsDemo(false);

    const { data } = await authApi.login(input);
    tokenStorage.set(data.accessToken, data.refreshToken);
    setUser(data.user);

    if (!data.user.character) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  const loginDemo = () => {
    // Clear real JWT tokens when entering demo mode
    tokenStorage.clear();
    const demoUser = demoStorage.enableDemo();
    setUser(demoUser);
    setIsDemo(true);
    router.push('/dashboard');
  };

  const logout = async () => {
    if (isDemo) {
      demoStorage.clearDemo();
      setIsDemo(false);
      setUser(null);
      router.push('/login');
      return;
    }

    try {
      await authApi.logout();
    } catch {
      /* ignore offline errors during logout */
    } finally {
      tokenStorage.clear();
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    if (isDemo) {
      const demoUser = demoStorage.getDemoUser() || DEMO_USER;
      setUser(demoUser);
      return;
    }

    try {
      const { data } = await authApi.me();
      setUser(data.user);
    } catch {
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isDemo,
        signup,
        login,
        loginDemo,
        logout,
        refreshUser,
      }}
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
