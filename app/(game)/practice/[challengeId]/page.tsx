'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getChallengeById, getAllChallenges, evaluateChallengeCode, EvaluationResult, PracticeChallenge } from '@/lib/practiceData';
import { getChallengeStatus, CHALLENGE_PREREQUISITES } from '@/lib/progression';
import { demoStorage } from '@/lib/demo';
import { Badge, DifficultyBadge } from '@/components/Badge';
import { Button } from '@/components/Button';

export default function ChallengePlayerPage({ params }: { params: Promise<{ challengeId: string }> }) {
  const { challengeId } = use(params);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const challenge = getChallengeById(challengeId) || getAllChallenges()[0];
  const allChallenges = getAllChallenges();

  const [code, setCode] = useState<string>(challenge.starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'tests' | 'hints'>('problem');

  useEffect(() => {
    setCode(challenge.starterCode);
    setEvalResult(null);
    setRevealedHintIndex(-1);
    setShowCompletionModal(false);
  }, [challenge.id]);

  const dynamicStatus = getChallengeStatus(user, challenge.id);
  const isCompleted = dynamicStatus === 'completed';
  const isLocked = dynamicStatus === 'locked';

  const attemptsMap = (user as { gameState?: { challengeAttempts?: Record<string, number> } })?.gameState?.challengeAttempts || {};
  const bestScoresMap = (user as { gameState?: { challengeBestScores?: Record<string, number> } })?.gameState?.challengeBestScores || {};
  const attempts = attemptsMap[challenge.id] || (isCompleted ? 1 : 0);
  const bestScore = bestScoresMap[challenge.id] || (isCompleted ? 100 : 0);

  // Find next challenge in sequence
  const currentIndex = allChallenges.findIndex((c) => c.id === challenge.id);
  const nextChallenge = currentIndex !== -1 && currentIndex < allChallenges.length - 1 ? allChallenges[currentIndex + 1] : null;

  // Run Code (Dry-run without state mutation)
  const handleRunCode = () => {
    setIsRunning(true);
    setEvalResult(null);

    setTimeout(() => {
      const result = evaluateChallengeCode(challenge.id, code);
      setEvalResult(result);
      setIsRunning(false);
      setActiveTab('tests');
    }, 450);
  };

  // Submit Trial (Authoritative completion)
  const handleSubmitTrial = () => {
    setIsSubmitting(true);
    setEvalResult(null);

    setTimeout(() => {
      const result = evaluateChallengeCode(challenge.id, code);
      setEvalResult(result);
      setIsSubmitting(false);
      setActiveTab('tests');

      if (result.success) {
        demoStorage.completeChallenge(challenge.id, challenge.reward.xp, challenge.reward.gold, 100);
        if (refreshUser) {
          refreshUser();
        }
        setShowCompletionModal(true);
      } else {
        demoStorage.recordChallengeAttempt(challenge.id, result.score);
        if (refreshUser) {
          refreshUser();
        }
      }
    }, 600);
  };

  const handleResetCode = () => {
    if (confirm('Reset editor to initial starter code?')) {
      setCode(challenge.starterCode);
      setEvalResult(null);
    }
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRevealNextHint = () => {
    setRevealedHintIndex((prev) => Math.min(challenge.hints.length - 1, prev + 1));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* ── Top Breadcrumbs & Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs">
            <Link href="/practice" className="font-semibold text-[var(--text-accent)] hover:underline flex items-center gap-1">
              ← Practice Hall
            </Link>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-muted)] font-mono">{challenge.regionName}</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-secondary)] font-mono truncate max-w-[200px] sm:max-w-none">
              {challenge.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
              {challenge.title}
            </h1>
            <DifficultyBadge difficulty={challenge.difficulty} />
            <Badge variant={isCompleted ? 'success' : 'gold'}>
              {isCompleted ? '✓ MASTERED' : `TRIAL ${challenge.stage}`}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-accent)] font-mono mt-0.5">
            {challenge.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right text-xs font-mono">
            <div className="text-[var(--text-gold)] font-bold">
              +{challenge.reward.xp} XP • +{challenge.reward.gold}g
            </div>
            <div className="text-[var(--text-muted)] text-[10px]">
              Attempts: {attempts} • Best: {bestScore}%
            </div>
          </div>

          <Link href="/quests">
            <Button variant="ghost" size="sm" className="text-xs border-[var(--border-default)]">
              ⚔️ Quests
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Locked Warning Banner (if visited while locked) ───────────── */}
      {isLocked && (
        <div className="p-4 rounded-2xl bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.3)] text-xs text-[var(--text-secondary)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <span>This coding trial is locked. Solve previous sanctuary challenges to activate combat submission.</span>
          </div>
          <Link href="/practice">
            <Button variant="gold" size="sm" className="text-xs">
              View Available Trials
            </Button>
          </Link>
        </div>
      )}

      {/* ── Main 2-Column Coding Arena ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Left Column: Problem, Test Cases & Hints (5 Cols) ───────── */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <button
              onClick={() => setActiveTab('problem')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'problem'
                  ? 'bg-[var(--primary-600)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <span>📜</span>
              <span>Objective</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'bg-[var(--primary-600)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <span>🧪</span>
              <span>Test Matrix ({challenge.testCases.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hints')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'hints'
                  ? 'bg-[var(--gold-500)] text-black font-bold shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-gold)]'
              }`}
            >
              <span>💡</span>
              <span>Hints ({challenge.hints.length})</span>
            </button>
          </div>

          {/* TAB 1: Problem Description & Objectives */}
          {activeTab === 'problem' && (
            <div className="devkit-panel p-5 sm:p-6 rounded-2xl border-[var(--border-muted)] bg-[var(--bg-surface)] space-y-5 shadow-lg animate-fade-in">
              <div>
                <h3 className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase tracking-wider mb-1">
                  Mission Inscription
                </h3>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              {/* Objectives List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-[var(--text-gold)] uppercase tracking-wider flex items-center gap-1">
                  <span>🎯</span> Trial Objectives
                </h4>
                <ul className="space-y-1.5">
                  {challenge.objectives.map((obj, idx) => (
                    <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                      <span className="text-[var(--text-accent)] font-bold">✓</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Concepts */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  Required Python Spellcraft:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {challenge.expectedConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[var(--bg-void)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-cyan)]"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Solution Overview snippet if already completed */}
              {isCompleted && (
                <div className="p-3.5 rounded-xl bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.3)] space-y-1 text-xs">
                  <div className="font-bold text-[var(--text-success)] font-mono flex items-center gap-1">
                    <span>✓</span> ARCHIVAL LORE RECORDED
                  </div>
                  <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                    {challenge.solutionExplanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Test Cases Specifications */}
          {activeTab === 'tests' && (
            <div className="devkit-panel p-5 rounded-2xl border-[var(--border-muted)] bg-[var(--bg-surface)] space-y-4 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <h3 className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase">
                  Test Case Assertions
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {challenge.testCases.length} Total Verification Rites
                </span>
              </div>

              <div className="space-y-3">
                {challenge.testCases.map((tc) => {
                  const resultMatch = evalResult?.testResults.find((r) => r.id === tc.id);
                  const isPassed = resultMatch?.passed;
                  const isTested = resultMatch !== undefined;

                  return (
                    <div
                      key={tc.id}
                      className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                        isTested
                          ? isPassed
                            ? 'bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.4)]'
                            : 'bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.4)]'
                          : 'bg-[var(--bg-void)] border-[var(--border-subtle)]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[var(--text-primary)]">
                          Test {tc.id}: {tc.description}
                        </span>
                        {isTested && (
                          <span className={`font-mono text-[11px] font-bold ${isPassed ? 'text-[var(--text-success)]' : 'text-[var(--text-danger)]'}`}>
                            {isPassed ? '✓ Passed' : '✗ Failed'}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="bg-[var(--bg-surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                          <div className="text-[9px] text-[var(--text-muted)]">INPUT / SCENARIO</div>
                          <div className="text-[var(--text-secondary)] truncate">{tc.input}</div>
                        </div>
                        <div className="bg-[var(--bg-surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                          <div className="text-[9px] text-[var(--text-muted)]">EXPECTED OUTPUT</div>
                          <div className="text-[var(--text-gold)] truncate">{tc.expectedOutput.replace(/\n/g, '↵ ')}</div>
                        </div>
                      </div>

                      {resultMatch && !isPassed && (
                        <div className="text-[11px] font-mono text-[var(--text-danger)] bg-[rgba(239,68,68,0.1)] p-2 rounded-lg">
                          Actual: {resultMatch.actual || 'None'} • Error: {resultMatch.error}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {evalResult && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  evalResult.success
                    ? 'bg-[rgba(16,185,129,0.08)] border-[var(--success)] text-[var(--text-success)]'
                    : 'bg-[rgba(239,68,68,0.08)] border-[var(--danger)] text-[var(--text-danger)]'
                }`}>
                  <strong className="block font-mono uppercase text-[10px] mb-0.5">
                    {evalResult.success ? '🎉 Evaluation Succeeded' : '⚠️ Evaluation Failed'}
                  </strong>
                  {evalResult.feedback}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Progressive Hint Drawer */}
          {activeTab === 'hints' && (
            <div className="devkit-panel p-5 rounded-2xl border-[var(--border-muted)] bg-[var(--bg-surface)] space-y-4 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <h3 className="text-xs font-mono font-bold text-[var(--text-gold)] uppercase">
                  Ancient Scribe's Hints
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Revealed: {revealedHintIndex + 1} / {challenge.hints.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {challenge.hints.map((hint, idx) => {
                  const isRevealed = idx <= revealedHintIndex;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs transition-all ${
                        isRevealed
                          ? 'bg-[rgba(245,158,11,0.05)] border-[rgba(245,158,11,0.3)] text-[var(--text-primary)]'
                          : 'bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-faint)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 font-mono text-[10px] uppercase font-bold text-[var(--text-gold)]">
                        <span>Hint {idx + 1}</span>
                        <span>{isRevealed ? 'Unlocked' : 'Locked'}</span>
                      </div>
                      <p className={isRevealed ? 'text-[var(--text-secondary)]' : 'blur-sm select-none'}>
                        {isRevealed ? hint : 'Inscribe the spell carefully and review syntax principles to decipher this hint.'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {revealedHintIndex < challenge.hints.length - 1 && (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleRevealNextHint}
                  className="w-full text-xs font-bold shadow-sm"
                >
                  💡 Reveal Next Hint ({revealedHintIndex + 2} of {challenge.hints.length})
                </Button>
              )}
            </div>
          )}

        </div>

        {/* ── Right Column: Code Editor & Execution Panel (7 Cols) ────── */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="devkit-panel p-0 rounded-2xl border-[var(--border-default)] bg-[var(--bg-void)] overflow-hidden shadow-2xl">
            
            {/* Editor Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-default)] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[var(--text-muted)] ml-2 text-[11px]">
                  solution.py • Python 3.12 (Spellcraft Arena)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="text-[11px] text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  {copiedCode ? '✓ Copied' : '📋 Copy'}
                </button>
                <span className="text-[var(--text-faint)]">|</span>
                <button
                  onClick={handleResetCode}
                  className="text-[11px] text-[var(--text-accent)] hover:underline"
                >
                  ↻ Reset
                </button>
              </div>
            </div>

            {/* Editable Python Code Buffer */}
            <div className="relative p-4 sm:p-5 bg-[rgba(10,10,15,0.98)] font-mono text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={13}
                spellCheck={false}
                placeholder="# Inscribe your Python code solution here..."
                className="w-full bg-transparent text-[var(--text-cyan)] font-mono focus:outline-none resize-y selection:bg-[var(--primary-subtle)] leading-relaxed"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Terminal Simulation Output Bar */}
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-400)] animate-pulse" />
                <span>Deterministic Test Evaluator Ready</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="md"
                  loading={isRunning}
                  onClick={handleRunCode}
                  className="flex-1 sm:flex-initial text-xs border-[var(--border-default)]"
                >
                  ▶ Run Code
                </Button>

                <Button
                  variant="gold"
                  size="md"
                  loading={isSubmitting}
                  onClick={handleSubmitTrial}
                  className="flex-1 sm:flex-initial font-bold text-xs shadow-md"
                >
                  ⚔️ Submit Trial
                </Button>
              </div>
            </div>

          </div>

          {/* Quick Guidance Card */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex items-start gap-3">
            <span className="text-base shrink-0">💡</span>
            <div className="space-y-1">
              <strong className="text-[var(--text-primary)] block font-mono uppercase text-[10px]">
                Developer Spellcraft Rules:
              </strong>
              <p className="text-[11px] leading-relaxed">
                Click <strong>Run Code</strong> to preview test executions without state penalty. Click <strong>Submit Trial</strong> when ready to conquer the challenge and claim combat XP.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ── Challenge Completion Modal ───────────────────────────────── */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,5,8,0.9)] backdrop-blur-md animate-fade-in">
          <div className="devkit-panel max-w-md w-full p-8 text-center space-y-6 animate-fade-in-scale border-[var(--border-muted)] shadow-[0_0_50px_rgba(245,158,11,0.25)] bg-[var(--bg-surface)]">
            
            {/* Victory Badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl border text-4xl shadow-2xl bg-[rgba(245,158,11,0.15)] border-[var(--gold-400)] shadow-[0_0_30px_rgba(245,158,11,0.3)] text-[var(--text-gold)]">
              ⚡
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-gold)]">
                Coding Trial Conquered!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display gradient-text">
                TRIAL COMPLETE
              </h2>
              <p className="text-sm text-[var(--text-secondary)] font-medium">
                {challenge.title}
              </p>
              <p className="text-xs text-[var(--text-muted)] italic">
                "Your Python spell passed all test assertions without flaw."
              </p>
            </div>

            {/* Bounty Stat Blocks */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
                <div className="text-base font-black text-[var(--text-gold)] font-mono">
                  +{challenge.reward.xp} XP
                </div>
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Combat XP</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
                <div className="text-base font-black text-[#f59e0b] font-mono">
                  +{challenge.reward.gold}g
                </div>
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Arcane Gold</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-void)] border border-[var(--border-subtle)]">
                <div className="text-base font-black text-[var(--text-success)] font-mono">
                  100%
                </div>
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Accuracy</div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col gap-2.5">
              {nextChallenge ? (
                <Link href={`/practice/${nextChallenge.id}`} className="w-full">
                  <Button variant="primary" size="lg" className="w-full font-bold shadow-[0_0_20px_var(--primary-glow)]">
                    Next Challenge: {nextChallenge.title} →
                  </Button>
                </Link>
              ) : (
                <Link href="/practice" className="w-full">
                  <Button variant="primary" size="lg" className="w-full font-bold shadow-[0_0_20px_var(--primary-glow)]">
                    Return to Practice Hall ⚡
                  </Button>
                </Link>
              )}

              {challenge.questId && (
                <Link href={`/quests/${challenge.questId}`} className="w-full">
                  <Button variant="accent" size="sm" className="w-full text-xs font-bold">
                    ⚔️ Return to Quest Encounter →
                  </Button>
                </Link>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Link href="/practice" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full text-xs border-[var(--border-default)]">
                    ⚡ Practice Hall
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
