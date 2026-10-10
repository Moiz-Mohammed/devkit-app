'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getAllQuests } from '@/lib/gameData';
import { getQuestStatus } from '@/lib/progression';
import { Badge, DifficultyBadge, QuestTypeBadge } from '@/components/Badge';
import { Button } from '@/components/Button';

export default function QuestBoardPage() {
  const { user } = useAuth();
  const allQuests = getAllQuests();

  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuests = allQuests.filter((q) => {
    // 1. Region Filter
    if (regionFilter !== 'all' && q.regionName !== regionFilter) {
      return false;
    }

    // 2. Difficulty Filter
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) {
      return false;
    }

    // 3. Status Filter
    const dynamicStatus = getQuestStatus(user, q.id);
    if (statusFilter === 'completed' && dynamicStatus !== 'completed') return false;
    if (statusFilter === 'active' && dynamicStatus !== 'active') return false;
    if (statusFilter === 'available' && dynamicStatus !== 'available' && dynamicStatus !== 'active') return false;
    if (statusFilter === 'locked' && dynamicStatus !== 'locked') return false;

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase">
              Mission Registry
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-400)]" />
            <span className="text-xs text-[var(--text-muted)] font-mono">Python Realm</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-[var(--text-primary)]">
            QUEST BOARD
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Choose a programming encounter to solve interactive code challenges and earn combat XP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/world-map">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              🗺️ Open World Map
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              ⚡ Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Filter Controls ─────────────────────────────────────────── */}
      <div className="devkit-panel p-4 sm:p-5 rounded-2xl border-[var(--border-muted)] bg-[var(--bg-surface)] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Region Filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
              Region Domain
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Regions' },
                { id: 'Python Village', label: '🏡 Python Village' },
                { id: 'Logic Forest', label: '🌲 Logic Forest' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRegionFilter(r.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    regionFilter === r.id
                      ? 'bg-[var(--primary-600)] text-white shadow-sm'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
              Difficulty Tier
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'novice', label: 'Novice' },
                { id: 'apprentice', label: 'Apprentice' },
                { id: 'journeyman', label: 'Journeyman' },
                { id: 'boss', label: 'Boss' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficultyFilter(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    difficultyFilter === d.id
                      ? 'bg-[var(--accent-600)] text-white shadow-sm'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
              Dynamic Status
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'available', label: '★ Available' },
                { id: 'completed', label: '✓ Cleared' },
                { id: 'locked', label: '🔒 Locked' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === s.id
                      ? 'bg-[var(--gold-500)] text-black font-bold shadow-sm'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Quest Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuests.map((q) => {
          const dynamicStatus = getQuestStatus(user, q.id);
          const isCompleted = dynamicStatus === 'completed';
          const isCurrentActive = dynamicStatus === 'active';
          const isAvailable = dynamicStatus === 'available' || isCurrentActive;
          const isLocked = dynamicStatus === 'locked';
          const isBoss = q.isBoss;

          return (
            <div
              key={q.id}
              className={`devkit-card p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                isBoss && !isLocked
                  ? 'border-[rgba(220,38,38,0.5)] bg-[rgba(220,38,38,0.04)] shadow-lg'
                  : isCurrentActive
                  ? 'border-[var(--primary-border)] bg-[rgba(124,58,237,0.06)] shadow-[0_0_24px_rgba(124,58,237,0.18)] ring-1 ring-[var(--primary-glow)]'
                  : isAvailable
                  ? 'border-[var(--gold-400)] bg-[rgba(245,158,11,0.03)] shadow-md'
                  : isCompleted
                  ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.02)]'
                  : 'border-[var(--border-subtle)] opacity-50 grayscale'
              }`}
            >
              <div className="space-y-4">
                
                {/* Badges Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    <DifficultyBadge difficulty={q.difficulty} />
                    <QuestTypeBadge type={q.type} />
                  </div>
                  <Badge variant={isCompleted ? 'success' : isCurrentActive ? 'accent' : isAvailable ? 'gold' : 'muted'}>
                    {isCompleted ? '✓ CLEARED' : isCurrentActive ? '● ACTIVE' : isAvailable ? '★ UNLOCKED' : '🔒 LOCKED'}
                  </Badge>
                </div>

                {/* Quest Titles & Description */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[var(--text-accent)] font-semibold uppercase">
                    📍 {q.regionName} • Stage {q.stage}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {q.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {q.description}
                  </p>
                </div>

              </div>

              {/* Footer Bounty & Action */}
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <div className="text-xs font-mono">
                  <span className="font-bold text-[var(--text-gold)]">+{q.xpReward} XP</span>
                  <span className="text-[var(--text-faint)] mx-1">•</span>
                  <span className="text-[#f59e0b]">+{q.goldReward || 40}g</span>
                </div>

                {!isLocked ? (
                  <Link href={`/quests/${q.id}`}>
                    <Button
                      variant={isCurrentActive ? 'primary' : isBoss ? 'danger' : isAvailable ? 'accent' : 'ghost'}
                      size="sm"
                      className={`font-bold text-xs ${
                        isCurrentActive
                          ? 'shadow-[0_0_16px_var(--primary-glow)]'
                          : 'border-[var(--border-default)]'
                      }`}
                    >
                      {isCompleted ? 'Replay Trial ↻' : isCurrentActive ? 'Begin Quest →' : 'Enter Trial →'}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="ghost" size="sm" disabled className="text-[10px] font-mono opacity-50">
                    🔒 Locked
                  </Button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
