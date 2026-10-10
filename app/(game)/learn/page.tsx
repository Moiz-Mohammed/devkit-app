'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getAllLessons, getLessonsByRegion } from '@/lib/learningData';
import { getLessonStatus, getRegionLessonProgress, LESSON_PREREQUISITES } from '@/lib/progression';
import { Badge, DifficultyBadge } from '@/components/Badge';
import { Button } from '@/components/Button';

export default function LearnDirectoryPage() {
  const { user } = useAuth();
  const allLessons = getAllLessons();

  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const pvProgress = getRegionLessonProgress(user, 'python-village');
  const lfProgress = getRegionLessonProgress(user, 'logic-forest');

  const filteredLessons = allLessons.filter((l) => {
    if (regionFilter !== 'all' && l.regionSlug !== regionFilter) return false;

    const dynamicStatus = getLessonStatus(user, l.id);
    if (statusFilter === 'completed' && dynamicStatus !== 'completed') return false;
    if (statusFilter === 'active' && dynamicStatus !== 'active') return false;
    if (statusFilter === 'available' && dynamicStatus !== 'available' && dynamicStatus !== 'active') return false;
    if (statusFilter === 'locked' && dynamicStatus !== 'locked') return false;

    return true;
  });

  const totalMastered = allLessons.filter((l) => getLessonStatus(user, l.id) === 'completed').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase tracking-wider">
              Arcane Grimoire
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-400)]" />
            <span className="text-xs text-[var(--text-muted)] font-mono">Foundational Code Lore</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-[var(--text-primary)]">
            KNOWLEDGE SANCTUARY
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Read structured knowledge tomes, explore interactive code examples, and pass checkpoint rites to acquire developer powers before entering battle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/world-map">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              🗺️ World Map
            </Button>
          </Link>
          <Link href="/quests">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              ⚔️ Quest Board
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Knowledge Mastery Summary Strip ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="devkit-card p-4 rounded-2xl border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center text-xl shrink-0">
            📖
          </div>
          <div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Realm Knowledge</div>
            <div className="text-base font-black font-display text-[var(--text-primary)]">
              {totalMastered} / {allLessons.length} Tomes Mastered
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
              {pvProgress.completedLessons} / {pvProgress.totalLessons} Lessons
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
              {lfProgress.completedLessons} / {lfProgress.totalLessons} Lessons
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
                { id: 'all', label: 'All Realms' },
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

          {/* Status Filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
              Study Status
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Status' },
                { id: 'active', label: '● Current Study' },
                { id: 'available', label: '★ Unlocked' },
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

      {/* ── Lesson Tome Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const dynamicStatus = getLessonStatus(user, lesson.id);
          const isCompleted = dynamicStatus === 'completed';
          const isCurrentActive = dynamicStatus === 'active';
          const isAvailable = dynamicStatus === 'available' || isCurrentActive;
          const isLocked = dynamicStatus === 'locked';

          // Prerequisite description if locked
          const prereqIds = LESSON_PREREQUISITES[lesson.id] || [];
          const prereqLesson = prereqIds.length > 0 ? allLessons.find((l) => l.id === prereqIds[0]) : null;

          return (
            <div
              key={lesson.id}
              className={`devkit-card p-6 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                isCurrentActive
                  ? 'border-[var(--primary-border)] bg-[rgba(124,58,237,0.06)] shadow-[0_0_24px_rgba(124,58,237,0.18)] ring-1 ring-[var(--primary-glow)]'
                  : isCompleted
                  ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.02)] hover:border-[var(--success)]'
                  : isAvailable
                  ? 'border-[var(--gold-400)] bg-[rgba(245,158,11,0.03)] shadow-md hover:border-[var(--gold-500)]'
                  : 'border-[var(--border-subtle)] opacity-50 grayscale'
              }`}
            >
              <div className="space-y-4">
                
                {/* Badges Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-muted)] text-[10px] font-mono font-bold text-[var(--text-accent)]">
                      Tome {lesson.orderIndex.toString().padStart(2, '0')}
                    </span>
                    <DifficultyBadge difficulty={lesson.difficulty} />
                  </div>
                  <Badge variant={isCompleted ? 'success' : isCurrentActive ? 'accent' : isAvailable ? 'gold' : 'muted'}>
                    {isCompleted ? '✓ MASTERED' : isCurrentActive ? '● CURRENT' : isAvailable ? '★ UNLOCKED' : '🔒 LOCKED'}
                  </Badge>
                </div>

                {/* Lesson Header */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                    {lesson.regionName} • Stage {lesson.stage}
                  </span>
                  <h2 className="text-lg font-bold font-display text-[var(--text-primary)] leading-snug">
                    {lesson.title}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {lesson.description}
                  </p>
                </div>

                {/* Objectives Snippet */}
                <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)] space-y-1.5">
                  <div className="text-[9px] font-mono text-[var(--text-gold)] uppercase font-bold flex items-center gap-1">
                    <span>📜</span> Key Inscriptions
                  </div>
                  <ul className="text-[11px] text-[var(--text-muted)] space-y-1 list-disc list-inside">
                    {lesson.objectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="truncate">{obj}</li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Footer Rewards & Action Button */}
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-gold)] font-bold">+{lesson.reward.xp} XP • +{lesson.reward.gold}g</span>
                  <span className="text-[var(--text-faint)]">⏱️ {lesson.estimatedMinutes} min read</span>
                </div>

                {isLocked && prereqLesson ? (
                  <div className="text-[10px] font-mono text-[var(--text-faint)] bg-[rgba(0,0,0,0.3)] p-2 rounded-lg text-center">
                    🔒 Requires: <span className="text-[var(--text-secondary)]">{prereqLesson.title}</span>
                  </div>
                ) : null}

                {!isLocked ? (
                  <Link href={`/learn/${lesson.id}`} className="block w-full">
                    <Button
                      variant={isCurrentActive ? 'primary' : isCompleted ? 'ghost' : 'accent'}
                      size="sm"
                      className={`w-full font-bold text-xs ${
                        isCurrentActive ? 'shadow-[0_0_16px_var(--primary-glow)]' : 'border-[var(--border-default)]'
                      }`}
                    >
                      {isCompleted ? 'Revisit Tome ↻' : isCurrentActive ? 'Continue Learning →' : 'Open Knowledge Tome →'}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="ghost" size="sm" disabled className="w-full text-xs font-mono opacity-50">
                    🔒 Locked Knowledge
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
