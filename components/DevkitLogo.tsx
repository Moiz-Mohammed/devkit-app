/**
 * DevkitLogo — DEVKIT brand mark, used across navigation and auth pages.
 *
 * Props:
 *   size   — 'sm' | 'md' | 'lg'
 *   href   — wraps in <a> if provided
 *   mono   — show only the icon mark, no wordmark
 */

import Link from 'next/link';

interface DevkitLogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  mono?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { icon: 'w-7 h-7 text-xs rounded-lg',  word: 'text-base' },
  md: { icon: 'w-9 h-9 text-sm rounded-lg',   word: 'text-xl'  },
  lg: { icon: 'w-12 h-12 text-base rounded-xl', word: 'text-2xl' },
};

export function DevkitLogo({ size = 'md', href, mono = false, className = '' }: DevkitLogoProps) {
  const cfg = SIZE_CONFIG[size];

  const content = (
    <span className={`flex items-center gap-2 select-none ${className}`}>
      {/* Icon mark */}
      <span
        className={`${cfg.icon} flex items-center justify-center font-black text-white shrink-0`}
        style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}
        aria-hidden
      >
        DK
      </span>

      {/* Wordmark */}
      {!mono && (
        <span
          className={`font-bold tracking-tight ${cfg.word}`}
          style={{ color: 'var(--text-primary)' }}
        >
          DEV
          <span style={{ color: 'var(--primary-400)' }}>KIT</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="w-fit">
        {content}
      </Link>
    );
  }

  return content;
}
