/**
 * LoadingState — skeleton loaders and spinner for async content.
 *
 * Exports:
 *   Spinner       — circular loading indicator
 *   Skeleton      — single skeleton block
 *   SkeletonCard  — full card-shaped skeleton
 *   PageLoader    — full-page centered spinner with optional message
 *   SkeletonText  — paragraph-shaped skeleton lines
 */

'use client';

/* ─── Spinner ────────────────────────────────────────────────────────────────── */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SPINNER_SIZE = { sm: '16px', md: '24px', lg: '40px' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const s = SPINNER_SIZE[size];
  return (
    <span
      className={`loading-spinner ${className}`}
      style={{ width: s, height: s }}
      role="status"
      aria-label="Loading"
    />
  );
}

/* ─── Skeleton Block ─────────────────────────────────────────────────────────── */
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({ width = '100%', height = '16px', className = '', rounded = false }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded ? '9999px' : undefined,
      }}
    />
  );
}

/* ─── Skeleton Text Lines ────────────────────────────────────────────────────── */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  const widths = ['100%', '85%', '70%', '90%', '60%'];
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={widths[i % widths.length]} height="14px" />
      ))}
    </div>
  );
}

/* ─── Skeleton Card ──────────────────────────────────────────────────────────── */
interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`devkit-card p-5 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton width="60px" height="20px" rounded />
        <Skeleton width="80px" height="20px" rounded />
      </div>
      <Skeleton height="20px" width="75%" />
      <SkeletonText lines={2} />
      <div className="flex items-center justify-between pt-1">
        <Skeleton width="70px" height="14px" />
        <Skeleton width="50px" height="14px" />
      </div>
    </div>
  );
}

/* ─── Page Loader ────────────────────────────────────────────────────────────── */
interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message }: PageLoaderProps) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg-base)', zIndex: 'var(--z-modal)' }}
    >
      {/* Logo */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white animate-pulse-glow"
        style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}
      >
        DK
      </div>
      <Spinner size="md" />
      {message && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {message}
        </p>
      )}
    </div>
  );
}
