'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: '', username: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.username.trim()) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'Minimum 3 characters';
    else if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) e.username = 'Letters, numbers, _ and - only';
    if (!form.password) e.password = 'Password is required';
    else if (!PASSWORD_REQUIREMENTS.every((r) => r.test(form.password)))
      e.password = 'Password does not meet requirements';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      await signup({ email: form.email, username: form.username, password: form.password });
    } catch (err: any) {
      setServerError(err?.response?.data?.error || 'Signup failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = PASSWORD_REQUIREMENTS.filter((r) => r.test(form.password)).length;
  const strengthColors = ['#ef4444', '#f59e0b', '#22c55e'];
  const strengthLabels = ['Weak', 'Getting there', 'Strong'];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black" style={{ color: '#f0f0ff' }}>
          Forge your{' '}
          <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            legend
          </span>
        </h1>
        <p style={{ color: '#8b8ba8' }}>Create your account and begin your quest. Free forever.</p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="p-4 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
          ⚠ {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold" style={{ color: '#8b8ba8' }}>Email</label>
          <input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`devkit-input ${errors.email ? 'error' : ''}`} />
          {errors.email && <p className="text-xs" style={{ color: '#f87171' }}>{errors.email}</p>}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold" style={{ color: '#8b8ba8' }}>Username</label>
          <input id="signup-username" type="text" autoComplete="username" placeholder="your_handle"
            value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={`devkit-input ${errors.username ? 'error' : ''}`} />
          {errors.username && <p className="text-xs" style={{ color: '#f87171' }}>{errors.username}</p>}
          {!errors.username && form.username && (
            <p className="text-xs" style={{ color: '#22c55e' }}>✓ Looks good</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold" style={{ color: '#8b8ba8' }}>Password</label>
          <div className="relative">
            <input id="signup-password" type={showPassword ? 'text' : 'password'}
              autoComplete="new-password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`devkit-input ${errors.password ? 'error' : ''}`}
              style={{ paddingRight: '44px' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: '#8b8ba8' }}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Password strength */}
          {form.password && (
            <div className="space-y-2">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ background: i < passwordStrength ? strengthColors[passwordStrength - 1] : 'var(--bg-border)' }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: passwordStrength > 0 ? strengthColors[passwordStrength - 1] : '#8b8ba8' }}>
                {form.password ? strengthLabels[passwordStrength - 1] || 'Weak' : ''}
              </p>
              <ul className="space-y-1">
                {PASSWORD_REQUIREMENTS.map((r) => (
                  <li key={r.label} className="text-xs flex items-center gap-1.5"
                    style={{ color: r.test(form.password) ? '#22c55e' : '#4a4a6a' }}>
                    <span>{r.test(form.password) ? '✓' : '○'}</span>
                    {r.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {errors.password && <p className="text-xs" style={{ color: '#f87171' }}>{errors.password}</p>}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold" style={{ color: '#8b8ba8' }}>Confirm Password</label>
          <input id="signup-confirm" type="password" autoComplete="new-password" placeholder="••••••••"
            value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className={`devkit-input ${errors.confirm ? 'error' : ''}`} />
          {errors.confirm && <p className="text-xs" style={{ color: '#f87171' }}>{errors.confirm}</p>}
        </div>

        <button id="signup-submit" type="submit" disabled={isLoading}
          className="btn-primary w-full" style={{ padding: '14px' }}>
          {isLoading ? (
            <span className="flex items-center gap-2"><Spinner /> Creating your account...</span>
          ) : (
            '🗡️ Create Account'
          )}
        </button>
      </form>

      <p className="text-center text-sm" style={{ color: '#8b8ba8' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: '#7c3aed' }}>
          Log in →
        </Link>
      </p>

      <p className="text-center text-xs" style={{ color: '#4a4a6a' }}>
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
