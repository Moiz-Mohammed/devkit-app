/**
 * Badge / DifficultyBadge — pill labels for quest difficulty, status, etc.
 */

import React from 'react';
import type { Quest } from '@/types';

/* ─── Generic Badge ──────────────────────────────────────────────────────────── */
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'gold' | 'success' | 'danger' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}

/* ─── Difficulty Badge ───────────────────────────────────────────────────────── */
type Difficulty = Quest['difficulty'];

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; className: string }> = {
  novice:     { label: 'Novice',     className: 'badge-novice' },
  apprentice: { label: 'Apprentice', className: 'badge-apprentice' },
  journeyman: { label: 'Journeyman', className: 'badge-journeyman' },
  expert:     { label: 'Expert',     className: 'badge-expert' },
  boss:       { label: '⚠ BOSS',     className: 'badge-boss' },
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  return (
    <span className={`badge ${cfg.className} ${className}`}>
      {cfg.label}
    </span>
  );
}

/* ─── Quest Type Badge ───────────────────────────────────────────────────────── */
type QuestType = Quest['type'];

const TYPE_CONFIG: Record<QuestType, { label: string; variant: BadgeProps['variant'] }> = {
  study:     { label: '📖 Study',     variant: 'accent' },
  challenge: { label: '⚔ Challenge', variant: 'primary' },
  boss:      { label: '💀 Boss',      variant: 'danger' },
};

interface QuestTypeBadgeProps {
  type: QuestType;
  className?: string;
}

export function QuestTypeBadge({ type, className = '' }: QuestTypeBadgeProps) {
  const cfg = TYPE_CONFIG[type];
  return <Badge variant={cfg.variant} className={className}>{cfg.label}</Badge>;
}

/* ─── Status Badge ───────────────────────────────────────────────────────────── */
type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed';

const STATUS_CONFIG: Record<QuestStatus, { label: string; variant: BadgeProps['variant'] }> = {
  locked:      { label: '🔒 Locked',       variant: 'muted' },
  available:   { label: '● Available',      variant: 'accent' },
  in_progress: { label: '◐ In Progress',   variant: 'primary' },
  completed:   { label: '✓ Completed',      variant: 'success' },
};

interface StatusBadgeProps {
  status: QuestStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return <Badge variant={cfg.variant} className={className}>{cfg.label}</Badge>;
}
