/**
 * lib/utils.ts — DEVKIT shared utility functions
 */

import type { EvolutionStage } from '@/types';

/** Format a number with K/M abbreviation */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/** Convert XP total → level number (every 100 XP = 1 level, +50 per level) */
export function xpToLevel(totalXP: number): number {
  let level = 1;
  let threshold = 100;
  let accumulated = 0;
  while (accumulated + threshold <= totalXP) {
    accumulated += threshold;
    level++;
    threshold = Math.floor(threshold * 1.2);
  }
  return level;
}

/** XP needed for the NEXT level from current */
export function xpToNextLevel(totalXP: number): number {
  let threshold = 100;
  let accumulated = 0;
  while (true) {
    if (accumulated + threshold > totalXP) return threshold - (totalXP - accumulated);
    accumulated += threshold;
    threshold = Math.floor(threshold * 1.2);
  }
}

/** Map numeric evolution stage (0–5) → EvolutionStage label */
export function stageLabel(stage: number): EvolutionStage {
  const stages: EvolutionStage[] = [
    'Newcomer', 'Recruit', 'Apprentice', 'Journeyman', 'Expert', 'Master',
  ];
  return stages[Math.min(stage, 5)] ?? 'Newcomer';
}

/** Get a relative time string ("2 days ago", "just now") */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Percentage helper — avoids division by zero */
export function pct(value: number, total: number, decimals = 1): number {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
}

/** Class name merging helper (no external dep needed) */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Colour map for career classes */
export const CLASS_COLORS: Record<string, string> = {
  'python-developer':    'var(--accent-500)',
  'ml-engineer':         '#a78bfa',
  'fullstack-architect': 'var(--primary-400)',
  'data-scientist':      '#f59e0b',
  'devops-warden':       '#10b981',
  'cyber-sentinel':      '#ef4444',
};

export function classColor(slug: string): string {
  return CLASS_COLORS[slug] ?? 'var(--primary-400)';
}
