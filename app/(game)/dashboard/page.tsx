'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { XPBar } from '@/components/XPBar';
import { Badge, DifficultyBadge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import { DEMO_GAME_STATE } from '@/lib/demo';
import { 
  getSynchronizedRegions, 
  getCurrentActiveQuest, 
  getCurrentActiveLesson, 
  getRegionLessonProgress,
  getCurrentActiveChallenge,
  getRegionChallengeProgress
} from '@/lib/progression';

export default function DashboardPage() {
  const { user } = useAuth();

  // Authoritative progression state sourced dynamically from user / demo engine
  const username = user?.username ?? 'Moiz';
  const charClass = user?.character?.class?.name ?? 'Python Developer';
  const level = user?.xp?.level ?? 7;
  const xp = user?.xp?.totalXP ?? 680;
  const xpToNext = user?.xp?.xpToNext ?? 320;
  const totalXpInLevel = xp + xpToNext;
  const streak = user?.streak?.currentStreak ?? 5;
  const gold = (user as { gameState?: typeof DEMO_GAME_STATE })?.gameState?.gold ?? DEMO_GAME_STATE.gold;
  const currentRegion = (user as { gameState?: typeof DEMO_GAME_STATE })?.gameState?.currentRegion ?? DEMO_GAME_STATE.currentRegion;
  const completedQuestsCount = (user as { gameState?: typeof DEMO_GAME_STATE })?.gameState?.completedQuestsCount ?? DEMO_GAME_STATE.completedQuestsCount;

  // Dynamic Active Quest, Active Lesson, Active Challenge, and Synchronized Realm Regions
  const activeQuest = getCurrentActiveQuest(user);
  const activeLesson = getCurrentActiveLesson(user);
  const activeChallenge = getCurrentActiveChallenge(user);
  const realmRegions = getSynchronizedRegions(user);

  // Region Lesson & Challenge Progress
  const pvLessonProgress = getRegionLessonProgress(user, 'python-village');
  const lfLessonProgress = getRegionLessonProgress(user, 'logic-forest');
  const pvChallengeProgress = getRegionChallengeProgress(user, 'python-village');
  const lfChallengeProgress = getRegionChallengeProgress(user, 'logic-forest');

  const recentActivities = [
    { id: 1, title: 'Conquered Code Challenge: Input Gatekeeper', type: 'practice', time: '1 hour ago', reward: '+120 XP', icon: '💻' },
    { id: 2, title: 'Defeated While-Loop Guardian', type: 'quest', time: '2 hours ago', reward: '+85 XP', icon: '⚔️' },
    { id: 3, title: 'Mastered Variables of Power Tome', type: 'learn', time: '4 hours ago', reward: '+30 XP', icon: '📖' },
    { id: 4, title: 'Unlocked Gate to Logic Forest', type: 'unlock', time: '5 hours ago', reward: 'New Realm', icon: '🔓' },
    { id: 5, title: '5-Day Streak Flame Maintained', type: 'streak', time: 'Yesterday', reward: '+50 Gold', icon: '🔥' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* ── Section A: GAME HUD ────────────────────────────────────────── */}
      <section className="devkit-panel p-6 sm:p-8 rounded-3xl border-[var(--border-muted)] bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-elevated)] to-[var(--bg-surface)] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Avatar & Player Info */}
          <div className="lg:col-span-5 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[var(--primary-600)] to-[var(--accent-500)] p-0.5 shadow-[0_0_20px_var(--primary-glow)]">
                <div className="w-full h-full rounded-2xl bg-[var(--bg-void)] flex items-center justify-center text-3xl sm:text-4xl">
                  🧙‍♂️
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[var(--gold-500)] text-[10px] font-black text-black">
                LVL {level.toString().padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
                  {username}
                </h1>
                <Badge variant="accent">{charClass}</Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <span>📍 Current Domain:</span>
                <span className="text-[var(--text-cyan)] font-semibold">{currentRegion}</span>
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="text-[var(--text-gold)] font-bold flex items-center gap-1">
                  🪙 {gold} Gold
                </span>
                <span className="text-[#fb923c] font-bold flex items-center gap-1">
                  🔥 {streak} Day Streak
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="lg:col-span-7 space-y-2 bg-[rgba(5,5,8,0.5)] p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[var(--text-accent)] uppercase tracking-wider">
                Level {level} Experience
              </span>
              <span className="text-[var(--text-muted)]">
                <strong className="text-[var(--text-primary)]">{xp}</strong> / {totalXpInLevel} XP ({xpToNext} XP to Level {level + 1})
              </span>
            </div>
            <XPBar current={xp} max={totalXpInLevel} level={level} size="lg" showLabel={false} />
          </div>

        </div>
      </section>

      {/* ── Main Grid Layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* ── Section B: CONTINUE JOURNEY (Active Quest, Active Lesson, Active Practice) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Dynamic Active Quest Card */}
            <div className="devkit-card p-5 rounded-3xl border-[var(--primary-border)] bg-gradient-to-br from-[rgba(124,58,237,0.1)] via-[var(--bg-surface)] to-[var(--bg-surface)] flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase flex items-center gap-1.5">
                    <span>⚔️</span> ACTIVE QUEST
                  </span>
                  <DifficultyBadge difficulty={activeQuest.difficulty} />
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">{activeQuest.regionName} • Stage {activeQuest.stage}</div>
                  <h3 className="text-base font-bold font-display text-[var(--text-primary)] leading-tight mt-0.5">
                    {activeQuest.title}
                  </h3>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {activeQuest.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[var(--text-gold)] font-bold">
                  +{activeQuest.xpReward} XP
                </span>
                <Link href={`/quests/${activeQuest.id}`}>
                  <Button variant="primary" size="sm" className="font-bold text-xs shadow-[0_0_16px_var(--primary-glow)]">
                    Battle Quest →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dynamic Active Lesson Card (CONTINUE LEARNING) */}
            <div className="devkit-card p-5 rounded-3xl border-[var(--gold-400)] bg-gradient-to-br from-[rgba(245,158,11,0.08)] via-[var(--bg-surface)] to-[var(--bg-surface)] flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[var(--text-gold)] uppercase flex items-center gap-1.5">
                    <span>📖</span> STUDY TOME
                  </span>
                  <Badge variant="gold">TOME {activeLesson.orderIndex.toString().padStart(2, '0')}</Badge>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">{activeLesson.regionName} • Stage {activeLesson.stage}</div>
                  <h3 className="text-base font-bold font-display text-[var(--text-primary)] leading-tight mt-0.5">
                    {activeLesson.title}
                  </h3>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {activeLesson.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[var(--text-gold)] font-bold">
                  +{activeLesson.reward.xp} XP
                </span>
                <Link href={`/learn/${activeLesson.id}`}>
                  <Button variant="gold" size="sm" className="font-bold text-xs shadow-md">
                    Open Tome →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dynamic Active Coding Practice Card (CONTINUE PRACTICE) */}
            <div className="devkit-card p-5 rounded-3xl border-[var(--cyan-400)] bg-gradient-to-br from-[rgba(6,182,212,0.08)] via-[var(--bg-surface)] to-[var(--bg-surface)] flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[var(--text-cyan)] uppercase flex items-center gap-1.5">
                    <span>💻</span> CODE PRACTICE
                  </span>
                  <DifficultyBadge difficulty={activeChallenge.difficulty} />
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">{activeChallenge.regionName} • Stage {activeChallenge.stage}</div>
                  <h3 className="text-base font-bold font-display text-[var(--text-primary)] leading-tight mt-0.5">
                    {activeChallenge.title}
                  </h3>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {activeChallenge.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[var(--text-cyan)] font-bold">
                  +{activeChallenge.reward.xp} XP
                </span>
                <Link href={`/practice/${activeChallenge.id}`}>
                  <Button variant="accent" size="sm" className="font-bold text-xs shadow-md">
                    Solve Code →
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          {/* ── Section D: PYTHON REALM PROGRESS (Dynamic Synchronization) ── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
                  <span>🗺️</span> Python Realm Progression
                </h2>
                <p className="text-xs text-[var(--text-muted)]">Live conquest, study & coding status across regional domains</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/practice">
                  <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
                    💻 Practice
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
                    📖 Grimoire
                  </Button>
                </Link>
                <Link href="/world-map">
                  <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
                    🗺️ Map ↗
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {realmRegions.map((region) => {
                const isCompleted = region.dynamicStatus === 'completed';
                const isActive = region.dynamicStatus === 'active';
                const isAvailable = region.dynamicStatus === 'available';
                const isLocked = region.dynamicStatus === 'locked';

                return (
                  <Link
                    key={region.slug}
                    href={isLocked ? '#' : `/regions/${region.slug}`}
                    className={`devkit-card p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isCompleted
                        ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.03)] hover:border-[var(--success)]'
                        : isActive
                        ? 'border-[var(--primary-border)] bg-[rgba(124,58,237,0.08)] shadow-[0_0_16px_rgba(124,58,237,0.15)] ring-1 ring-[var(--primary-glow)]'
                        : isAvailable
                        ? 'border-[var(--gold-400)] bg-[rgba(245,158,11,0.05)] shadow-md hover:border-[var(--gold-500)]'
                        : 'border-[var(--border-subtle)] opacity-50 grayscale cursor-not-allowed'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{region.icon}</span>
                        <Badge variant={isCompleted ? 'success' : isActive ? 'accent' : isAvailable ? 'gold' : 'muted'}>
                          {isCompleted ? 'CLEARED' : isActive ? 'ACTIVE' : isAvailable ? 'UNLOCKED' : 'LOCKED'}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{region.name}</h3>
                        <p className="text-[11px] font-mono text-[var(--text-muted)]">{region.recommendedLevel}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-1 text-[11px] font-mono">
                      <div className="flex items-center justify-between text-[var(--text-secondary)]">
                        <span>⚔️ Quests:</span>
                        <span className="text-[var(--text-primary)] font-bold">{region.completedQuestsCount} / {region.totalQuestsCount}</span>
                      </div>
                      {region.totalLessonsCount > 0 && (
                        <div className="flex items-center justify-between text-[var(--text-secondary)]">
                          <span>📖 Lessons:</span>
                          <span className="text-[var(--text-gold)] font-bold">{region.completedLessonsCount} / {region.totalLessonsCount}</span>
                        </div>
                      )}
                      {region.totalChallengesCount > 0 && (
                        <div className="flex items-center justify-between text-[var(--text-secondary)]">
                          <span>💻 Practice:</span>
                          <span className="text-[var(--text-cyan)] font-bold">{region.completedChallengesCount} / {region.totalChallengesCount}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Section F: KNOWLEDGE & PRACTICE REPOSITORY BREAKDOWN ───────────── */}
          <section className="devkit-card p-6 rounded-2xl border-[var(--border-default)] bg-[var(--bg-surface)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
                  <span>📜</span> MASTERY BREAKDOWN BY DOMAIN
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Track theoretical study and live coding trials across programming realms</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/learn">
                  <Button variant="ghost" size="sm" className="text-xs text-[var(--text-gold)] hover:underline">
                    📖 Grimoire
                  </Button>
                </Link>
                <Link href="/practice">
                  <Button variant="ghost" size="sm" className="text-xs text-[var(--text-cyan)] hover:underline">
                    💻 Practice Hall →
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Python Village Progress */}
              <div className="p-4 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>🏡</span> Python Village
                  </span>
                  <span className="text-[var(--text-success)] font-bold">
                    Cleared
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>📖 Knowledge Tomes:</span>
                    <span className="text-[var(--text-gold)] font-bold">{pvLessonProgress.completedLessons} / {pvLessonProgress.totalLessons} ({pvLessonProgress.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <div className="h-full bg-[var(--gold-400)] transition-all" style={{ width: `${pvLessonProgress.pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)] pt-1">
                    <span>💻 Code Practice:</span>
                    <span className="text-[var(--text-cyan)] font-bold">{pvChallengeProgress.completedChallenges} / {pvChallengeProgress.totalChallenges} ({pvChallengeProgress.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <div className="h-full bg-[var(--cyan-400)] transition-all" style={{ width: `${pvChallengeProgress.pct}%` }} />
                  </div>
                </div>
              </div>

              {/* Logic Forest Progress */}
              <div className="p-4 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>🌲</span> Logic Forest
                  </span>
                  <span className="text-[var(--text-cyan)] font-bold">
                    Active
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>📖 Knowledge Tomes:</span>
                    <span className="text-[var(--text-gold)] font-bold">{lfLessonProgress.completedLessons} / {lfLessonProgress.totalLessons} ({lfLessonProgress.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <div className="h-full bg-[var(--gold-400)] transition-all" style={{ width: `${lfLessonProgress.pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)] pt-1">
                    <span>💻 Code Practice:</span>
                    <span className="text-[var(--text-cyan)] font-bold">{lfChallengeProgress.completedChallenges} / {lfChallengeProgress.totalChallenges} ({lfChallengeProgress.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <div className="h-full bg-[var(--cyan-400)] transition-all" style={{ width: `${lfChallengeProgress.pct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (4 Cols): Player Progression, Stats & Activity */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* ── Section C: PLAYER METRICS ──────────────────────────── */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
              <span>📊</span> Adventurer Profile
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                value={`Lvl ${level}`}
                label="Combat Rank"
                sublabel="Journeyman"
                accentColor="var(--text-accent)"
              />
              <StatCard
                value={completedQuestsCount}
                label="Quests Solved"
                sublabel="100% Accuracy"
                accentColor="var(--text-success)"
              />
              <StatCard
                value={`${streak} Days`}
                label="Active Streak"
                sublabel="Top 5% Learner"
                accentColor="#fb923c"
              />
              <StatCard
                value={`${gold}g`}
                label="Arcane Gold"
                sublabel="Forge Currency"
                accentColor="var(--text-gold)"
              />
            </div>
          </section>

          {/* ── Equipped Weapon Card ──────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
                <span>🗡️</span> Active Weapon
              </h2>
              <Link href="/forge" className="text-xs text-[var(--text-accent)] hover:underline">
                Visit Forge →
              </Link>
            </div>

            <div className="devkit-card p-5 rounded-2xl border-[var(--border-default)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-muted)] flex items-center justify-center text-3xl shrink-0 shadow-md">
                  🗡️
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">Python Blade (Apprentice)</div>
                  <div className="text-xs text-[var(--text-gold)] font-mono">+10% Python XP Active</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[var(--border-subtle)]">
                <div className="bg-[var(--bg-void)] p-2 rounded-lg text-center">
                  <div className="text-[10px] text-[var(--text-muted)]">POWER</div>
                  <div className="font-bold text-[var(--text-accent)]">72</div>
                </div>
                <div className="bg-[var(--bg-void)] p-2 rounded-lg text-center">
                  <div className="text-[10px] text-[var(--text-muted)]">TIER</div>
                  <div className="font-bold text-[var(--text-gold)]">Forged (II)</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section E: RECENT ACTIVITY LOG ─────────────────────── */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
              <span>📜</span> Chronicle of Deeds
            </h2>

            <div className="devkit-card p-4 rounded-2xl border-[var(--border-default)] space-y-3">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{act.icon}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--text-primary)] truncate">{act.title}</p>
                      <p className="text-[10px] text-[var(--text-faint)]">{act.time}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[var(--text-gold)] shrink-0 ml-2">
                    {act.reward}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
