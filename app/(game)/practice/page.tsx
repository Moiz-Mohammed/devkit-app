'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getAllChallenges, getChallengesByRegion } from '@/lib/practiceData';
import { getChallengeStatus, getRegionChallengeProgress, CHALLENGE_PREREQUISITES } from '@/lib/progression';
import { Badge, DifficultyBadge } from '@/components/Badge';
import { Button } from '@/components/Button';

export default function PracticeHubPage() {
  const { user } = useAuth();
  const allChallenges = getAllChallenges();

  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const pvProgress = getRegionChallengeProgress(user, 'python-village');
  const lfProgress = getRegionChallengeProgress(user, 'logic-forest');

  const filteredChallenges = allChallenges.filter((c) => {
    if (regionFilter !== 'all' && c.regionSlug !== regionFilter) return false;
    if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;

    const dynamicStatus = getChallengeStatus(user, c.id);
    if (statusFilter === 'completed' && dynamicStatus !== 'completed') return false;
    if (statusFilter === 'active' && dynamicStatus !== 'active') return false;
    if (statusFilter === 'available' && dynamicStatus !== 'available' && dynamicStatus !== 'active') return false;
    if (statusFilter === 'locked' && dynamicStatus !== 'locked') return false;

    return true;
  });

  const totalMastered = allChallenges.filter((c) => getChallengeStatus(user, c.id) === 'completed').length;
  const attempts = (user as { gameState?: { challengeAttempts?: Record<string, number> } })?.gameState?.challengeAttempts || {};
  const bestScores = (user as { gameState?: { challengeBestScores?: Record<string, number> } })?.gameState?.challengeBestScores || {};

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase tracking-wider">
              Training Grounds & Arena
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-400)]" />
            <span className="text-xs text-[var(--text-muted)] font-mono">Python Code Trials</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-[var(--text-primary)]">
            CODING PRACTICE HALL
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Hone your programming spells in real code trials. Write Python scripts, satisfy test assertions, and earn combat XP and arcane gold.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/learn">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              📖 Grimoire
            </Button>
          </Link>
          <Link href="/world-map">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              🗺️ World Map
            </Button>
          </Link>
          <Link href="/quests">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              ⚔️ Quests
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Mastery Summary Strip ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="devkit-card p-4 rounded-2xl border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center text-xl shrink-0">
            ⚡
          </div>
          <div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Total Trials Mastered</div>
            <div className="text-base font-black font-display text-[var(--text-gold)]">
              {totalMastered} / {allChallenges.length} Conquered
            </div>
          </div>
        </div>

        <div className="devkit-card p-4 rounded-2xl border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-xl shrink-0">
            🏡
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase flex justify-between">
              <span>Python Village</span>
              <span className="text-[var(--text-success)] font-bold">{pvProgress.pct}%</span>
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)]">
              {pvProgress.completedChallenges} / {pvProgress.totalChallenges} Trials Solved
            </div>
          </div>
        </div>

        <div className="devkit-card p-4 rounded-2xl border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] flex items-center justify-center text-xl shrink-0">
            🌲
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase flex justify-between">
              <span>Logic Forest</span>
              <span className="text-[var(--text-cyan)] font-bold">{lfProgress.pct}%</span>
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)]">
              {lfProgress.completedChallenges} / {lfProgress.totalChallenges} Trials Solved
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Controls ─────────────────────────────────────────── */}
      <div className="devkit-panel p-4 sm:p-5 rounded-2xl border-[var(--border-muted)] bg-[var(--bg-surface)] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Region Filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
              Filter by Domain
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Domains' },
                { id: 'python-village', label: '🏡 Python Village' },
                { id: 'logic-forest', label: '🌲 Logic Forest' },
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
                { id: 'all', label: 'All Tiers' },
                { id: 'novice', label: 'Novice' },
                { id: 'apprentice', label: 'Apprentice' },
                { id: 'journeyman', label: 'Journeyman' },
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
              Trial Status
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Status' },
                { id: 'active', label: '● Active Trial' },
                { id: 'available', label: '★ Available' },
                { id: 'completed', label: '✓ Mastered' },
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

      {/* ── Challenge Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => {
          const dynamicStatus = getChallengeStatus(user, challenge.id);
          const isCompleted = dynamicStatus === 'completed';
          const isCurrentActive = dynamicStatus === 'active';
          const isAvailable = dynamicStatus === 'available' || isCurrentActive;
          const isLocked = dynamicStatus === 'locked';

          const prereqIds = CHALLENGE_PREREQUISITES[challenge.id] || [];
          const prereqChallenge = prereqIds.length > 0 ? allChallenges.find((c) => c.id === prereqIds[0]) : null;

          const challengeAttempts = attempts[challenge.id] || (isCompleted ? 1 : 0);
          const bestScore = bestScores[challenge.id] || (isCompleted ? 100 : 0);

          return (
            <div
              key={challenge.id}
              className={`devkit-card p-6 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                isCurrentActive
                  ? 'border-[var(--gold-400)] bg-[rgba(245,158,11,0.06)] shadow-[0_0_24px_rgba(245,158,11,0.18)] ring-1 ring-[var(--gold-400)]'
                  : isCompleted
                  ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.02)] hover:border-[var(--success)]'
                  : isAvailable
                  ? 'border-[var(--primary-border)] bg-[rgba(124,58,237,0.03)] shadow-md hover:border-[var(--primary-500)]'
                  : 'border-[var(--border-subtle)] opacity-50 grayscale'
              }`}
            >
              <div className="space-y-4">
                
                {/* Badges Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-muted)] text-[10px] font-mono font-bold text-[var(--text-gold)]">
                      Trial {challenge.orderIndex.toString().padStart(2, '0')}
                    </span>
                    <DifficultyBadge difficulty={challenge.difficulty} />
                  </div>
                  <Badge variant={isCompleted ? 'success' : isCurrentActive ? 'gold' : isAvailable ? 'accent' : 'muted'}>
                    {isCompleted ? '✓ MASTERED' : isCurrentActive ? '● ACTIVE' : isAvailable ? '★ UNLOCKED' : '🔒 LOCKED'}
                  </Badge>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                    {challenge.regionName} • Stage {challenge.stage}
                  </span>
                  <h2 className="text-lg font-bold font-display text-[var(--text-primary)] leading-snug">
                    {challenge.title}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {challenge.description}
                  </p>
                </div>

                {/* Concepts Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {challenge.expectedConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[var(--bg-void)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-accent)]"
                    >
                      {concept}
                    </span>
                  ))}
                </div>

                {/* Stats row if attempted */}
                {challengeAttempts > 0 && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-void)] p-2 rounded-xl border border-[var(--border-subtle)]">
                    <span>Attempts: <strong className="text-[var(--text-primary)]">{challengeAttempts}</strong></span>
                    <span>Best: <strong className="text-[var(--text-gold)]">{bestScore}%</strong></span>
                    <span>Tests: <strong className="text-[var(--text-cyan)]">{challenge.testCases.length}</strong></span>
                  </div>
                )}

              </div>

              {/* Footer Rewards & Action Button */}
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-gold)] font-bold">+{challenge.reward.xp} XP • +{challenge.reward.gold}g</span>
                  <span className="text-[var(--text-faint)]">⏱️ {challenge.estimatedMinutes}m trial</span>
                </div>

                {isLocked && prereqChallenge ? (
                  <div className="text-[10px] font-mono text-[var(--text-faint)] bg-[rgba(0,0,0,0.3)] p-2 rounded-lg text-center">
                    🔒 Requires: <span className="text-[var(--text-secondary)]">{prereqChallenge.title}</span>
                  </div>
                ) : null}

                {!isLocked ? (
                  <Link href={`/practice/${challenge.id}`} className="block w-full">
                    <Button
                      variant={isCurrentActive ? 'gold' : isCompleted ? 'ghost' : 'primary'}
                      size="sm"
                      className={`w-full font-bold text-xs ${
                        isCurrentActive ? 'shadow-[0_0_16px_var(--gold-glow)]' : 'border-[var(--border-default)]'
                      }`}
                    >
                      {isCompleted ? 'Review Trial ↻' : isCurrentActive ? 'Enter Coding Trial →' : 'Begin Trial →'}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="ghost" size="sm" disabled className="w-full text-xs font-mono opacity-50">
                    🔒 Locked Trial
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
