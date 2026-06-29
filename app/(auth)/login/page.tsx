'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import type { Metadata } from 'next';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      await login(form);
    } catch (err: any) {
      setServerError(err?.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black" style={{ color: '#f0f0ff' }}>
          Welcome back,{' '}
          <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            adventurer
          </span>
        </h1>
        <p style={{ color: '#8b8ba8' }}>Your quests await. Log in to continue your journey.</p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="p-4 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
          ⚠ {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold" style={{ color: '#8b8ba8' }}>Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`devkit-input ${errors.email ? 'error' : ''}`}
          />
          {errors.email && <p className="text-xs" style={{ color: '#f87171' }}>{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold" style={{ color: '#8b8ba8' }}>Password</label>
            <Link href="/forgot-password" className="text-xs hover:underline"
              style={{ color: '#7c3aed' }}>Forgot password?</Link>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`devkit-input ${errors.password ? 'error' : ''}`}
          />
          {errors.password && <p className="text-xs" style={{ color: '#f87171' }}>{errors.password}</p>}
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
          style={{ padding: '14px' }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner /> Entering the realm...
            </span>
          ) : (
            '⚔️ Enter DEVKIT'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: 'var(--bg-border)' }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>New here?</span>
        <div className="flex-1 h-px" style={{ background: 'var(--bg-border)' }} />
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm" style={{ color: '#8b8ba8' }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold hover:underline" style={{ color: '#7c3aed' }}>
          Start your journey →
        </Link>
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
