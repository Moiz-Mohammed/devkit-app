/**
 * XPBar — animated experience progress bar.
 *
 * Props:
 *   current  — current XP within the level
 *   max      — XP needed to reach next level
 *   level    — current player level (displayed as badge)
 *   size     — 'sm' | 'md' | 'lg' (bar height)
 *   showLabel — whether to display "X / Y XP" label
 *   animated  — whether the fill animates in on mount
 */

'use client';

import { useEffect, useState } from 'react';

interface XPBarProps {
  current: number;
  max: number;
  level?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function XPBar({
  current,
  max,
  level,
  size = 'md',
  showLabel = true,
  animated = true,
  className = '',
}: XPBarProps) {
  const [displayPct, setDisplayPct] = useState(animated ? 0 : Math.min((current / max) * 100, 100));

  useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => {
      setDisplayPct(Math.min((current / max) * 100, 100));
    }, 120);
    return () => clearTimeout(t);
  }, [current, max, animated]);

  const sizeClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-2.5' : 'h-2';

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || level !== undefined) && (
        <div className="flex items-center justify-between mb-1.5">
          {level !== undefined && (
            <div className="level-badge text-xs">{level}</div>
          )}
          {showLabel && (
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {current.toLocaleString()}
              <span style={{ color: 'var(--text-faint)' }}> / {max.toLocaleString()} XP</span>
            </span>
          )}
        </div>
      )}
      <div className={`xp-bar-track ${sizeClass}`}>
        <div
          className="xp-bar-fill"
          style={{ width: `${displayPct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
