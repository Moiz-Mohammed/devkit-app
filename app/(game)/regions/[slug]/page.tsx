'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getRegionBySlug, getQuestsByRegion, getAllRegions } from '@/lib/gameData';
import { getLessonsByRegion } from '@/lib/learningData';
import { getChallengesByRegion } from '@/lib/practiceData';
import { 
  getRegionQuestProgress, 
  getRegionLessonProgress, 
  getRegionChallengeProgress,
  getQuestStatus, 
  getLessonStatus,
  getChallengeStatus,
  LESSON_PREREQUISITES 
} from '@/lib/progression';
import { Button } from '@/components/Button';
import { Badge, DifficultyBadge, QuestTypeBadge } from '@/components/Badge';

export default function RegionHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();

  const region = getRegionBySlug(slug) || getAllRegions()[1];
  const quests = getQuestsByRegion(slug);
  const lessons = getLessonsByRegion(slug);
  const challenges = getChallengesByRegion(slug);

  // Dynamic Region Progress & Status from centralized progression engine
  const questProgress = getRegionQuestProgress(user, slug);
  const lessonProgress = getRegionLessonProgress(user, slug);
  const challengeProgress = getRegionChallengeProgress(user, slug);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* ── Top Header & Breadcrumb ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs">
            <Link href="/world-map" className="font-semibold text-[var(--text-accent)] hover:underline flex items-center gap-1">
              ← World Map
            </Link>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-muted)] font-mono">{region.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl">{region.icon}</span>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-4xl font-black font-display text-[var(--text-primary)]">
                  {region.name}
                </h1>
                <Badge variant={
                  questProgress.status === 'completed'
                    ? 'success'
                    : questProgress.status === 'active'
                    ? 'accent'
                    : questProgress.status === 'available'
                    ? 'gold'
                    : 'muted'
                }>
                  {questProgress.status === 'active' ? '● CURRENT DOMAIN' : questProgress.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-accent)] font-mono font-medium mt-0.5">
                {region.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/practice">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              💻 Practice Hall
            </Button>
          </Link>
          <Link href="/learn">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              📖 Grimoire
            </Button>
          </Link>
          <Link href="/quests">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              📜 Global Quest Log
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Lore & Triple Mastery Panel ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Lore Card */}
        <div className="lg:col-span-7 devkit-panel p-6 sm:p-7 rounded-3xl border-[var(--border-muted)] bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-elevated)] to-[var(--bg-surface)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-gold)] uppercase tracking-wider font-mono">
            <span>📜</span> Domain History & Environment
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
            "{region.lore}"
          </p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {region.description}
          </p>
        </div>

        {/* Triple Progress & Boss Card */}
        <div className="lg:col-span-5 devkit-card p-6 rounded-3xl border-[var(--border-default)] flex flex-col justify-between space-y-4 bg-[var(--bg-surface)]">
          <div className="space-y-3">
            
            {/* Knowledge Progress */}
            {lessons.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="font-mono text-[var(--text-gold)] font-bold uppercase text-[10px] flex items-center gap-1">
                    <span>📖</span> Knowledge Tomes
                  </span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">
                    {lessonProgress.completedLessons} / {lessonProgress.totalLessons} ({lessonProgress.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-void)] overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className="h-full rounded-full bg-[var(--gold-400)] transition-all duration-500"
                    style={{ width: `${lessonProgress.pct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Combat Trial Progress */}
            <div>
              <div className="flex items-baseline justify-between text-xs mb-1">
                <span className="font-mono text-[var(--text-accent)] font-bold uppercase text-[10px] flex items-center gap-1">
                  <span>⚔️</span> Combat Trials
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {questProgress.completedQuests} / {questProgress.totalQuests} ({questProgress.pct}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--bg-void)] overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-400)] transition-all duration-500"
                  style={{ width: `${questProgress.pct}%` }}
                />
              </div>
            </div>

            {/* Coding Challenge Progress */}
            {challenges.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="font-mono text-[var(--text-cyan)] font-bold uppercase text-[10px] flex items-center gap-1">
                    <span>💻</span> Coding Practice
                  </span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">
                    {challengeProgress.completedChallenges} / {challengeProgress.totalChallenges} ({challengeProgress.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-void)] overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className="h-full rounded-full bg-[var(--cyan-400)] transition-all duration-500"
                    style={{ width: `${challengeProgress.pct}%` }}
                  />
                </div>
              </div>
            )}

          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              Guardian / Dungeon Boss
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[var(--boss-red)]">👾 {region.bossName}</span>
              <DifficultyBadge difficulty={region.bossDifficulty} />
            </div>
          </div>
        </div>

      </div>

      {/* ── 1. KNOWLEDGE TOMES (FOUNDATION) ───────────────────────────── */}
      {lessons.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
                <span>📖</span> STEP 1: Study Knowledge Tomes
              </h2>
              <p className="text-xs text-[var(--text-muted)]">Read theoretical inscriptions and pass checkpoint rites</p>
            </div>
            <span className="text-xs font-mono text-[var(--text-gold)]">
              {lessonProgress.completedLessons} / {lessonProgress.totalLessons} Mastered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lessons.map((l) => {
              const dynamicStatus = getLessonStatus(user, l.id);
              const isCompleted = dynamicStatus === 'completed';
              const isCurrentActive = dynamicStatus === 'active';
              const isAvailable = dynamicStatus === 'available' || isCurrentActive;
              const isLocked = dynamicStatus === 'locked';

              return (
                <div
                  key={l.id}
                  className={`devkit-card p-4 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                    isCurrentActive
                      ? 'border-[var(--primary-border)] bg-[rgba(124,58,237,0.08)] shadow-[0_0_16px_rgba(124,58,237,0.15)] ring-1 ring-[var(--primary-glow)]'
                      : isCompleted
                      ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.02)]'
                      : isAvailable
                      ? 'border-[var(--gold-400)] bg-[rgba(245,158,11,0.03)]'
                      : 'border-[var(--border-subtle)] opacity-50 grayscale'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-accent)] uppercase">
                        Stage {l.stage} • Tome
                      </span>
                      <Badge variant={isCompleted ? 'success' : isCurrentActive ? 'accent' : isAvailable ? 'gold' : 'muted'}>
                        {isCompleted ? '✓ MASTERED' : isCurrentActive ? '● STUDY' : isAvailable ? '★ UNLOCKED' : '🔒 LOCKED'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2">
                        {l.title}
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-1">
                        {l.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-gold)]">
                      <span>+{l.reward.xp} XP • +{l.reward.gold}g</span>
                      <span className="text-[var(--text-faint)]">⏱️ {l.estimatedMinutes}m</span>
                    </div>

                    {!isLocked ? (
                      <Link href={`/learn/${l.id}`} className="block w-full">
                        <Button
                          variant={isCurrentActive ? 'primary' : isCompleted ? 'ghost' : 'gold'}
                          size="sm"
                          className="w-full text-xs font-bold"
                        >
                          {isCompleted ? 'Revisit Tome ↻' : isCurrentActive ? 'Study Now →' : 'Open Tome →'}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" size="sm" disabled className="w-full text-xs font-mono opacity-50">
                        🔒 Locked
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. REGIONAL TRIALS & COMBAT (PRACTICE) ───────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
              <span>⚔️</span> STEP 2: Execute Battle Trials
            </h2>
            <p className="text-xs text-[var(--text-muted)]">Apply your theoretical knowledge to conquer code encounters</p>
          </div>
          <span className="text-xs font-mono text-[var(--text-cyan)]">
            {questProgress.completedQuests} / {questProgress.totalQuests} Cleared
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {quests.map((q) => {
            const dynamicStatus = getQuestStatus(user, q.id);
            const isCompleted = dynamicStatus === 'completed';
            const isCurrentActive = dynamicStatus === 'active';
            const isAvailable = dynamicStatus === 'available' || isCurrentActive;
            const isLocked = dynamicStatus === 'locked';
            const isBoss = q.isBoss;

            return (
              <div
                key={q.id}
                className={`devkit-card p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all ${
                  isBoss && !isLocked
                    ? 'border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.04)] shadow-lg'
                    : isCurrentActive
                    ? 'border-[var(--primary-border)] bg-[rgba(124,58,237,0.06)] shadow-[0_0_20px_rgba(124,58,237,0.15)] ring-1 ring-[var(--primary-glow)]'
                    : isAvailable
                    ? 'border-[var(--gold-400)] bg-[rgba(245,158,11,0.03)] shadow-md'
                    : isCompleted
                    ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.02)]'
                    : 'border-[var(--border-subtle)] opacity-50 grayscale'
                }`}
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--text-accent)]">
                      Stage {q.stage}
                    </span>
                    <DifficultyBadge difficulty={q.difficulty} />
                    <QuestTypeBadge type={q.type} />
                    {isCurrentActive && (
                      <Badge variant="accent">● CURRENT OBJECTIVE</Badge>
                    )}
                    {isAvailable && !isCurrentActive && !isCompleted && (
                      <Badge variant="gold">★ UNLOCKED</Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="success">✓ CONQUERED</Badge>
                    )}
                    {isLocked && (
                      <Badge variant="muted">🔒 LOCKED</Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {q.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {q.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-gold)] pt-1">
                    <span>+{q.xpReward} XP</span>
                    <span>•</span>
                    <span className="text-[#f59e0b]">+{q.goldReward || 40} Gold</span>
                    <span>•</span>
                    <span className="text-[var(--text-muted)]">{q.questions.length} Questions</span>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  {!isLocked ? (
                    <Link href={`/quests/${q.id}`} className="w-full sm:w-auto">
                      <Button
                        variant={isCurrentActive ? 'primary' : isBoss ? 'danger' : isAvailable ? 'accent' : 'ghost'}
                        size="md"
                        className={`w-full sm:w-auto font-bold ${
                          isCurrentActive ? 'shadow-[0_0_20px_var(--primary-glow)]' : 'border-[var(--border-default)]'
                        }`}
                      >
                        {isCompleted ? 'Replay Trial ↻' : isCurrentActive ? 'Launch Quest →' : 'Enter Trial →'}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="ghost" size="md" disabled className="w-full sm:w-auto text-xs font-mono opacity-50">
                      🔒 Locked Trial
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. CODING PRACTICE TRIALS (HANDS-ON) ───────────────────── */}
      {challenges.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
                <span>💻</span> STEP 3: Master Coding Practice Trials
              </h2>
              <p className="text-xs text-[var(--text-muted)]">Write, debug, and submit real executable Python algorithms</p>
            </div>
            <span className="text-xs font-mono text-[var(--text-cyan)]">
              {challengeProgress.completedChallenges} / {challengeProgress.totalChallenges} Mastered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((c) => {
              const dynamicStatus = getChallengeStatus(user, c.id);
              const isCompleted = dynamicStatus === 'completed';
              const isCurrentActive = dynamicStatus === 'active';
              const isAvailable = dynamicStatus === 'available' || isCurrentActive;
              const isLocked = dynamicStatus === 'locked';

              return (
                <div
                  key={c.id}
                  className={`devkit-card p-4 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                    isCurrentActive
                      ? 'border-[var(--primary-border)] bg-[rgba(124,58,237,0.08)] shadow-[0_0_16px_rgba(124,58,237,0.15)] ring-1 ring-[var(--primary-glow)]'
                      : isCompleted
                      ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.02)]'
                      : isAvailable
                      ? 'border-[var(--cyan-400)] bg-[rgba(6,182,212,0.03)]'
                      : 'border-[var(--border-subtle)] opacity-50 grayscale'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-cyan)] uppercase">
                        Stage {c.stage} • Practice
                      </span>
                      <DifficultyBadge difficulty={c.difficulty} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2">
                        {c.title}
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-1">
                        {c.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-gold)]">
                      <span className="text-[var(--text-cyan)]">+{c.reward.xp} XP</span>
                      <span>+{c.reward.gold} Gold</span>
                    </div>

                    {!isLocked ? (
                      <Link href={`/practice/${c.id}`} className="block w-full">
                        <Button
                          variant={isCurrentActive ? 'accent' : isCompleted ? 'ghost' : 'accent'}
                          size="sm"
                          className="w-full text-xs font-bold"
                        >
                          {isCompleted ? 'Re-Solve Code ↻' : isCurrentActive ? 'Code Now →' : 'Enter Practice →'}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" size="sm" disabled className="w-full text-xs font-mono opacity-50">
                        🔒 Locked Practice
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
