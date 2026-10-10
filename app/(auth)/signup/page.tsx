'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { DevkitLogo } from '@/components/DevkitLogo';

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const { signup, loginDemo } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsOffline(false);

    // 1. Password confirmation check
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    // 2. Password strength check
    if (!REQUIREMENTS.every((r) => r.test(form.password))) {
      setError('Password does not meet the security criteria.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        username: form.username,
        email: form.email,
        password: form.password,
      });
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { error?: string }; status?: number } })?.response;
      
      if (!responseData) {
        setIsOffline(true);
        setError('Server is currently offline. You can jump directly into the game using Demo Mode.');
      } else {
        setError(responseData.data?.error || 'Registration failed. The email or username may already be in use.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="lg:hidden mb-4">
          <DevkitLogo size="md" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-300)]">
          🧙‍♂️ Character Genesis
        </div>
        <h1 className="text-3xl font-black font-display tracking-tight text-[var(--text-primary)]">
          CREATE AN ACCOUNT
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Forge your profile and begin your coding quest.
        </p>
      </div>

      {error && (
        <div className={`p-4 rounded-xl text-xs space-y-1.5 border animate-fade-in ${
          isOffline 
            ? 'bg-[rgba(245,158,11,0.08)] border-[rgba(245,158,11,0.25)] text-[var(--text-gold)]'
            : 'bg-[var(--danger-subtle)] border-[rgba(239,68,68,0.25)] text-[var(--text-danger)]'
        }`}>
          <div className="font-bold flex items-center gap-1.5">
            <span>{isOffline ? '⚠️ BACKEND UNREACHABLE' : '⚠️ SIGNUP ERROR'}</span>
          </div>
          <p className="leading-relaxed">{error}</p>
          {isOffline && (
            <button
              type="button"
              onClick={() => loginDemo()}
              className="mt-2 text-xs font-bold text-[var(--text-cyan)] hover:underline"
            >
              Click here to launch Demo Mode instantly →
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Hero Username"
          type="text"
          placeholder="e.g. CodeSorcerer99"
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          required
          minLength={3}
          maxLength={20}
          autoComplete="username"
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="hero@devkit.dev"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
          autoComplete="email"
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            autoComplete="new-password"
          />

          {/* Strength Indicators */}
          {form.password.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {REQUIREMENTS.map((r) => {
                const ok = r.test(form.password);
                return (
                  <div
                    key={r.label}
                    className={`text-[10px] font-medium p-1.5 rounded-lg border text-center transition-colors ${
                      ok
                        ? 'bg-[var(--success-subtle)] border-[rgba(16,185,129,0.3)] text-[var(--text-success)]'
                        : 'bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-faint)]'
                    }`}
                  >
                    {ok ? '✓ ' : '○ '}
                    {r.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••••••"
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          required
          autoComplete="new-password"
        />

        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full font-bold tracking-wide shadow-[0_0_20px_var(--primary-glow)]"
          >
            CREATE ACCOUNT
          </Button>
        </div>
      </form>

      <div className="pt-2 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-[var(--text-accent)] hover:text-white hover:underline transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
