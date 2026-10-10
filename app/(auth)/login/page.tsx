'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { DevkitLogo } from '@/components/DevkitLogo';

export default function LoginPage() {
  const { login, loginDemo } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsOffline(false);
    setLoading(true);

    try {
      await login(form);
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { error?: string }; status?: number } })?.response;
      
      if (!responseData) {
        // Backend API is offline / unreachable
        setIsOffline(true);
        setError('Server is currently offline. You can jump right in using Demo Mode below.');
      } else {
        setError(responseData.data?.error || 'Invalid credentials. Please verify your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    loginDemo();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="lg:hidden mb-4">
          <DevkitLogo size="md" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-300)]">
          ⚔️ Authentication Gate
        </div>
        <h1 className="text-3xl font-black font-display tracking-tight text-[var(--text-primary)]">
          ENTER THE REALM
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Log in with your credentials or explore the platform in prototype Demo Mode.
        </p>
      </div>

      {error && (
        <div className={`p-4 rounded-xl text-xs space-y-1.5 border animate-fade-in ${
          isOffline 
            ? 'bg-[rgba(245,158,11,0.08)] border-[rgba(245,158,11,0.25)] text-[var(--text-gold)]'
            : 'bg-[var(--danger-subtle)] border-[rgba(239,68,68,0.25)] text-[var(--text-danger)]'
        }`}>
          <div className="font-bold flex items-center gap-1.5">
            <span>{isOffline ? '⚠️ BACKEND UNREACHABLE' : '⚠️ AUTHENTICATION ERROR'}</span>
          </div>
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="developer@realm.dev"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
          autoComplete="current-password"
        />

        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full font-bold tracking-wide shadow-[0_0_20px_var(--primary-glow)]"
          >
            ENTER DEVKIT
          </Button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[var(--border-default)]"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono uppercase text-[var(--text-faint)]">
              OR INSTANT PREVIEW
            </span>
            <div className="flex-grow border-t border-[var(--border-default)]"></div>
          </div>

          <Button
            type="button"
            variant="accent"
            size="lg"
            onClick={handleDemoClick}
            className="w-full font-bold tracking-wide shadow-[0_0_20px_var(--accent-glow)]"
          >
            ⚡ ENTER DEMO (NO BACKEND REQUIRED)
          </Button>
        </div>
      </form>

      <div className="pt-2 text-center text-sm text-[var(--text-muted)]">
        Don&apos;t have a character yet?{' '}
        <Link
          href="/signup"
          className="font-semibold text-[var(--text-accent)] hover:text-white hover:underline transition-colors"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
