/**
 * Card — base surface container.
 *
 * Variants:
 *   default    — standard card
 *   interactive — hoverable, clickable
 *   panel      — elevated floating panel
 *   quest      — quest card with boss state
 *   region     — world map region card
 *   stat       — stat block
 */

import React from 'react';

/* ─── Base Card ──────────────────────────────────────────────────────────────── */
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'panel';
  className?: string;
  onClick?: () => void;
}

export function Card({ children, variant = 'default', className = '', onClick }: CardProps) {
  const cls = {
    default:     'devkit-card',
    interactive: 'devkit-card devkit-card-interactive',
    panel:       'devkit-panel',
  }[variant];

  return (
    <div className={`${cls} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

/* ─── Quest Card ─────────────────────────────────────────────────────────────── */
import type { Quest, QuestProgress } from '@/types';
import { DifficultyBadge, QuestTypeBadge, StatusBadge } from './Badge';

interface QuestCardProps {
  quest: Quest;
  progress?: QuestProgress;
  onClick?: () => void;
  className?: string;
}

export function QuestCard({ quest, progress, onClick, className = '' }: QuestCardProps) {
  const status = progress?.status ?? 'available';
  const isBoss = quest.isBoss || quest.type === 'boss';
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <div
      className={`quest-card ${isBoss ? 'boss-quest' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={isLocked ? undefined : onClick}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <DifficultyBadge difficulty={quest.difficulty} />
          <QuestTypeBadge type={quest.type} />
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Title */}
      <h3
        className="font-semibold text-sm leading-snug mb-2"
        style={{ color: isLocked ? 'var(--text-muted)' : 'var(--text-primary)' }}
      >
        {quest.title}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--text-muted)' }}>
        {quest.description}
      </p>

      {/* Footer — XP reward + material drops */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color: 'var(--text-gold)' }}>
          +{quest.xpReward.toLocaleString()} XP
        </span>
        {progress?.attempts && progress.attempts > 0 && (
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Boss glow accent border */}
      {isBoss && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(220,38,38,0.2)' }}
        />
      )}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────────── */
interface StatCardProps {
  value: React.ReactNode;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export function StatCard({ value, label, sublabel, icon, accentColor, className = '' }: StatCardProps) {
  return (
    <div className={`stat-block ${className}`}>
      {icon && (
        <div className="mb-2 text-2xl">{icon}</div>
      )}
      <div
        className="stat-value"
        style={{ color: accentColor ?? 'var(--text-primary)' }}
      >
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {sublabel && (
        <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

/* ─── Reward Card ────────────────────────────────────────────────────────────── */
interface RewardCardProps {
  icon: React.ReactNode;
  label: string;
  amount: string | number;
  className?: string;
}

export function RewardCard({ icon, label, amount, className = '' }: RewardCardProps) {
  return (
    <div className={`reward-card ${className}`}>
      <span className="text-xl shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
          {label}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>×{amount}</div>
      </div>
    </div>
  );
}
