/**
 * SkillNode — individual node in a skill tree.
 *
 * States: unlocked | available | locked
 * Renders: icon, tooltip label, connector lines via CSS
 */

'use client';

import { useState } from 'react';

export type SkillNodeState = 'unlocked' | 'available' | 'locked';

interface SkillNodeProps {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  state: SkillNodeState;
  xpRequired?: number;
  onClick?: () => void;
}

export function SkillNode({
  label,
  description,
  icon = '⬡',
  state,
  xpRequired,
  onClick,
}: SkillNodeProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative flex flex-col items-center gap-1">
      <button
        className={`skill-node ${state}`}
        onClick={state !== 'locked' ? onClick : undefined}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        aria-label={`${label} — ${state}`}
        aria-disabled={state === 'locked'}
      >
        <span className="text-xl select-none">{icon}</span>

        {/* Unlocked check mark */}
        {state === 'unlocked' && (
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--success)', color: '#fff' }}
          >
            ✓
          </span>
        )}
      </button>

      {/* Label */}
      <span
        className="text-xs font-medium text-center max-w-[72px] leading-tight"
        style={{ color: state === 'locked' ? 'var(--text-faint)' : 'var(--text-secondary)' }}
      >
        {label}
      </span>

      {/* Tooltip */}
      {showTip && (
        <div className="tooltip absolute bottom-full mb-2 z-50 text-left" style={{ minWidth: '160px' }}>
          <div className="font-semibold text-xs mb-1" style={{ color: 'var(--text-primary)' }}>
            {label}
          </div>
          {description && (
            <div className="text-xs" style={{ color: 'var(--text-muted)', whiteSpace: 'normal' }}>
              {description}
            </div>
          )}
          {state === 'locked' && xpRequired && (
            <div className="mt-1 text-xs" style={{ color: 'var(--text-gold)' }}>
              Requires {xpRequired.toLocaleString()} XP
            </div>
          )}
        </div>
      )}
    </div>
  );
}
