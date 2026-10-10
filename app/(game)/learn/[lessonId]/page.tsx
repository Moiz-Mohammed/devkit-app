'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getLessonById, getAllLessons, GameLesson } from '@/lib/learningData';
import { getLessonStatus, getCompletedLessonIds, LESSON_PREREQUISITES } from '@/lib/progression';
import { demoStorage } from '@/lib/demo';
import { Badge, DifficultyBadge } from '@/components/Badge';
import { Button } from '@/components/Button';

export default function LessonDetailPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const lesson = getLessonById(lessonId) || getAllLessons()[0];
  const allLessons = getAllLessons();

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmittedCheckpoint, setHasSubmittedCheckpoint] = useState<boolean>(false);
  const [isCheckpointPassed, setIsCheckpointPassed] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [revealedOutputs, setRevealedOutputs] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const totalSections = lesson.sections.length;
  const isCheckpointStep = activeSectionIndex === totalSections;
  const currentSection = !isCheckpointStep ? lesson.sections[activeSectionIndex] : null;

  // Derive status
  const currentStatus = getLessonStatus(user, lesson.id);
  const isAlreadyCompleted = currentStatus === 'completed';

  // Checkpoint submission handler
  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    setHasSubmittedCheckpoint(true);
    const correct = selectedAnswer === lesson.checkpoint.correctAnswer;
    setIsCheckpointPassed(correct);

    if (correct) {
      // Apply authoritative state changes via centralized demoStorage
      demoStorage.completeLesson(lesson.id, lesson.reward.xp, lesson.reward.gold);
      if (refreshUser) {
        refreshUser();
      }
      setShowCompletionModal(true);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setHasSubmittedCheckpoint(false);
    setIsCheckpointPassed(false);
  };

  const handleCopyCode = (code: string, secId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(secId);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const toggleOutput = (secId: string) => {
    setRevealedOutputs((prev) => ({
      ...prev,
      [secId]: !prev[secId],
    }));
  };

  // Locate next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIndex !== -1 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* ── Top Breadcrumb & Navigation Bar ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs">
            <Link href="/learn" className="font-semibold text-[var(--text-accent)] hover:underline flex items-center gap-1">
              ← Grimoire
            </Link>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-muted)] font-mono">{lesson.regionName}</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-secondary)] font-mono truncate max-w-[200px] sm:max-w-none">
              {lesson.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-3xl font-black font-display text-[var(--text-primary)]">
              {lesson.title}
            </h1>
            <DifficultyBadge difficulty={lesson.difficulty} />
            <Badge variant={isAlreadyCompleted ? 'success' : 'accent'}>
              {isAlreadyCompleted ? '✓ MASTERED' : `STAGE ${lesson.stage}`}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-accent)] font-mono mt-1">
            {lesson.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-mono text-[var(--text-gold)]">
            +{lesson.reward.xp} XP • +{lesson.reward.gold}g
          </span>
          <span className="text-[var(--text-muted)] text-xs">⏱️ {lesson.estimatedMinutes}m</span>
        </div>
      </div>

      {/* ── Tome Section Step Tabs ──────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border-subtle)]">
        {lesson.sections.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => setActiveSectionIndex(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSectionIndex === idx
                ? 'bg-[var(--primary-600)] text-white shadow-md'
                : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <span>📜</span>
            <span>Section {idx + 1}</span>
          </button>
        ))}

        <button
          onClick={() => setActiveSectionIndex(totalSections)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            isCheckpointStep
              ? 'bg-[var(--gold-500)] text-black font-bold shadow-md'
              : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-gold)]'
          }`}
        >
          <span>⚔️</span>
          <span>Checkpoint Rite</span>
          {isAlreadyCompleted && <span className="text-[10px]">✓</span>}
        </button>
      </div>

      {/* ── Main Tome Content Card ──────────────────────────────────── */}
      {!isCheckpointStep && currentSection && (
        <div className="space-y-6">
          
          <div className="devkit-panel p-6 sm:p-8 rounded-3xl border-[var(--border-muted)] bg-[var(--bg-surface)] space-y-6 relative overflow-hidden shadow-xl">
            
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">
                {currentSection.title}
              </h2>
              <span className="text-[10px] font-mono text-[var(--text-faint)]">
                Reading {activeSectionIndex + 1} of {totalSections}
              </span>
            </div>

            {/* Content Body */}
            <div className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed space-y-4 whitespace-pre-line font-serif-reading">
              {currentSection.content}
            </div>

            {/* Code Demonstration Block (if present) */}
            {currentSection.codeExample && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono px-3 py-1.5 rounded-t-xl bg-[var(--bg-void)] border-t border-x border-[var(--border-default)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="text-[var(--text-muted)] ml-2 text-[11px]">Python Tome Inscription</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(currentSection.codeExample || '', currentSection.id)}
                    className="text-[11px] text-[var(--text-accent)] hover:underline flex items-center gap-1"
                  >
                    {copiedCode === currentSection.id ? '✓ Copied' : '📋 Copy Code'}
                  </button>
                </div>

                <div className="relative bg-[rgba(5,5,8,0.95)] p-4 sm:p-5 rounded-b-xl border border-[var(--border-default)] font-mono text-xs sm:text-sm text-[var(--text-cyan)] overflow-x-auto leading-relaxed shadow-inner">
                  <pre className="select-text">{currentSection.codeExample}</pre>
                </div>

                {/* Output Console Box */}
                {currentSection.output && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        Terminal Output Preview
                      </span>
                      <button
                        onClick={() => toggleOutput(currentSection.id)}
                        className="text-[10px] font-mono text-[var(--text-gold)] hover:underline"
                      >
                        {revealedOutputs[currentSection.id] ? 'Hide Output ▲' : 'Reveal Output ▼'}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] overflow-x-auto">
                      <div className="text-[10px] text-[var(--text-faint)] mb-1">$ python spell.py</div>
                      <pre className="text-[var(--text-secondary)] whitespace-pre-wrap">
                        {currentSection.output}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Explanation text */}
                {currentSection.explanation && (
                  <div className="p-4 rounded-xl bg-[rgba(124,58,237,0.04)] border border-[var(--primary-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-1 mt-3">
                    <div className="font-bold text-[var(--text-accent)] font-mono uppercase text-[10px] flex items-center gap-1">
                      <span>💡</span> Inscription Explanation
                    </div>
                    <p>{currentSection.explanation}</p>
                  </div>
                )}

              </div>
            )}

            {/* Pro-Tip Callout */}
            {currentSection.tip && (
              <div className="p-4 rounded-xl bg-[rgba(245,158,11,0.04)] border border-[rgba(245,158,11,0.2)] text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-2.5">
                <span className="text-base shrink-0">📜</span>
                <div>
                  <strong className="text-[var(--text-gold)] font-mono uppercase text-[10px] block mb-0.5">
                    Ancient Scribe's Tip
                  </strong>
                  <span>{currentSection.tip}</span>
                </div>
              </div>
            )}

          </div>

          {/* Section Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="md"
              disabled={activeSectionIndex === 0}
              onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
              className="text-xs border-[var(--border-default)]"
            >
              ← Previous Inscription
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => setActiveSectionIndex((prev) => prev + 1)}
              className="text-xs font-bold shadow-[0_0_16px_var(--primary-glow)]"
            >
              {activeSectionIndex + 1 === totalSections ? 'Proceed to Checkpoint Rite ⚔️' : 'Next Inscription →'}
            </Button>
          </div>

        </div>
      )}

      {/* ── Checkpoint Rite Step ────────────────────────────────────── */}
      {isCheckpointStep && (
        <div className="space-y-6">
          
          <div className="devkit-panel p-6 sm:p-8 rounded-3xl border-[var(--border-muted)] bg-[var(--bg-surface)] space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[var(--text-gold)] uppercase tracking-wider">
                  Knowledge Evaluation
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
                  Checkpoint Rite
                </h2>
              </div>
              <Badge variant="gold">PASS TO COMPLETE</Badge>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Demonstrate your mastery of the concepts inscribed in this tome to claim your reward and unlock downstream knowledge.
            </p>

            {/* Checkpoint Question Block */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--bg-void)] border border-[var(--border-default)]">
                <p className="text-sm sm:text-base font-bold text-[var(--text-primary)] whitespace-pre-line">
                  {lesson.checkpoint.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {lesson.checkpoint.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === lesson.checkpoint.correctAnswer;

                  let optionStyles = 'border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--primary-border)] hover:bg-[var(--bg-hover)]';

                  if (hasSubmittedCheckpoint) {
                    if (isCorrect) {
                      optionStyles = 'border-[var(--success)] bg-[var(--success-subtle)] text-[var(--text-success)]';
                    } else if (isSelected && !isCorrect) {
                      optionStyles = 'border-[var(--danger)] bg-[var(--danger-subtle)] text-[var(--text-danger)]';
                    } else {
                      optionStyles = 'border-[var(--border-subtle)] opacity-40';
                    }
                  } else if (isSelected) {
                    optionStyles = 'border-[var(--primary-500)] bg-[var(--primary-subtle)] shadow-[0_0_12px_var(--primary-glow)] text-white';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmittedCheckpoint && isCheckpointPassed}
                      onClick={() => !hasSubmittedCheckpoint && setSelectedAnswer(opt)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${optionStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-muted)] flex items-center justify-center text-xs font-mono font-bold text-[var(--text-muted)]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium">{opt}</span>
                      </div>

                      {hasSubmittedCheckpoint && isCorrect && (
                        <span className="text-[var(--text-success)] font-bold text-xs">✓ Correct</span>
                      )}
                      {hasSubmittedCheckpoint && isSelected && !isCorrect && (
                        <span className="text-[var(--text-danger)] font-bold text-xs">✗ Incorrect</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {hasSubmittedCheckpoint && (
                <div className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
                  isCheckpointPassed
                    ? 'bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.3)]'
                    : 'bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.3)]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase font-mono ${
                      isCheckpointPassed ? 'text-[var(--text-success)]' : 'text-[var(--text-danger)]'
                    }`}>
                      {isCheckpointPassed ? '🎉 Flawless Answer! Knowledge Mastered!' : '⚠️ Incorrect Answer — Reflect and Retry'}
                    </span>
                    {!isCheckpointPassed && (
                      <Button variant="ghost" size="sm" onClick={handleRetry} className="text-xs text-[var(--text-gold)]">
                        Retry Checkpoint ↻
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {lesson.checkpoint.explanation}
                  </p>
                </div>
              )}

            </div>

            {/* Checkpoint Submit CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setActiveSectionIndex(totalSections - 1)}
                className="w-full sm:w-auto text-xs border-[var(--border-default)]"
              >
                ← Back to Inscriptions
              </Button>

              {!hasSubmittedCheckpoint ? (
                <Button
                  variant="gold"
                  size="md"
                  disabled={!selectedAnswer}
                  onClick={handleCheckAnswer}
                  className="w-full sm:w-auto font-bold text-xs shadow-md"
                >
                  Confirm Checkpoint Answer →
                </Button>
              ) : isCheckpointPassed ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowCompletionModal(true)}
                  className="w-full sm:w-auto font-bold text-xs shadow-[0_0_16px_var(--primary-glow)]"
                >
                  View Reward Summary ★
                </Button>
              ) : null}
            </div>

          </div>

        </div>
      )}

      {/* ── Lesson Complete Modal ───────────────────────────────────── */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,5,8,0.9)] backdrop-blur-md animate-fade-in">
          <div className="devkit-panel max-w-md w-full p-8 text-center space-y-6 animate-fade-in-scale border-[var(--border-muted)] shadow-[0_0_50px_rgba(124,58,237,0.2)] bg-[var(--bg-surface)]">
            
            {/* Trophy Rune */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl border text-4xl shadow-2xl bg-[var(--primary-subtle)] border-[var(--primary-border)] shadow-[0_0_30px_var(--primary-glow)] text-[var(--text-gold)]">
              📜
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Grimoire Consecration
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display gradient-text">
                KNOWLEDGE ACQUIRED!
              </h2>
              <p className="text-sm text-[var(--text-secondary)] font-medium">
                {lesson.title}
              </p>
              <p className="text-xs text-[var(--text-muted)] italic">
                "The knowledge is yours. Proceed forth to test your spells."
              </p>
            </div>

            {/* Bounty Stat Blocks */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
                <div className="text-lg font-black text-[var(--text-gold)] font-mono">
                  +{lesson.reward.xp} XP
                </div>
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Knowledge Bounty</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
                <div className="text-lg font-black text-[#f59e0b] font-mono">
                  +{lesson.reward.gold}g
                </div>
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Arcane Coin</div>
              </div>
            </div>

            {/* Knowledge Gained Tags */}
            <div className="space-y-2 text-left">
              <div className="text-[10px] font-mono font-bold text-[var(--text-gold)] uppercase tracking-wider">
                ✨ Conceptual Powers Unlocked:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {lesson.reward.knowledgeGained.map((k, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-void)] border border-[var(--border-default)] text-[11px] font-semibold text-[var(--text-cyan)]"
                  >
                    ✦ {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col gap-2.5">
              {nextLesson ? (
                <Link href={`/learn/${nextLesson.id}`} className="w-full">
                  <Button variant="primary" size="lg" className="w-full font-bold shadow-[0_0_20px_var(--primary-glow)]">
                    Next Lesson: {nextLesson.title} →
                  </Button>
                </Link>
              ) : (
                <Link href="/learn" className="w-full">
                  <Button variant="primary" size="lg" className="w-full font-bold shadow-[0_0_20px_var(--primary-glow)]">
                    Return to Knowledge Grimoire 📖
                  </Button>
                </Link>
              )}

              {lesson.associatedQuestId && (
                <Link href={`/quests/${lesson.associatedQuestId}`} className="w-full">
                  <Button variant="accent" size="sm" className="w-full text-xs font-bold">
                    ⚔️ Practice in Battle Quest →
                  </Button>
                </Link>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Link href="/learn" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full text-xs border-[var(--border-default)]">
                    📖 Grimoire
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full text-xs border-[var(--border-default)]">
                    ⚡ Dashboard
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
