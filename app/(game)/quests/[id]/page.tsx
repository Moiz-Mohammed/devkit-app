'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { demoStorage } from '@/lib/demo';
import { getQuestById, type GameQuest } from '@/lib/gameData';
import MCQQuestion from '@/components/quest/MCQQuestion';
import QuestComplete from '@/components/quest/QuestComplete';
import { Badge, DifficultyBadge, QuestTypeBadge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { XPBar } from '@/components/XPBar';
import { PageLoader } from '@/components/LoadingState';

export default function ActiveQuestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { isDemo, refreshUser } = useAuth();

  const [quest, setQuest] = useState<GameQuest | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hintsUsed, setHintsUsed] = useState<Record<string, boolean>>({});

  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [goldEarned, setGoldEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // AXIOM AI Hint States
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  useEffect(() => {
    const fetchQuest = async () => {
      // 1. Check gameData module content first
      const localQuest = getQuestById(id);
      if (localQuest) {
        setQuest(localQuest);
        setIsLoading(false);
        return;
      }

      // 2. Fallback to API if available
      try {
        const { data } = await api.get(`/quests/${id}`);
        setQuest(data);
      } catch (err) {
        console.warn('API quest fetch unreachable. Using default fallback quest.', err);
        const fallback = getQuestById('quest-loops') || getQuestById('quest-intro');
        if (fallback) setQuest(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuest();
  }, [id]);

  const handleSelectAnswer = (answer: string) => {
    if (!quest) return;
    const currentQuestion = quest.questions[currentQuestionIdx];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleFetchAiHint = async () => {
    if (!quest) return;
    const currentQuestion = quest.questions[currentQuestionIdx];

    setIsLoadingHint(true);
    setAiHint(null);

    try {
      const { data } = await api.post(`/quests/${id}/hint`, {
        questionId: currentQuestion.id,
      });
      setAiHint(data.hint);
      setHintsUsed((prev) => ({ ...prev, [currentQuestion.id]: true }));
    } catch {
      // Socratic fallback explanation excerpt
      setAiHint(
        currentQuestion.explanation ||
          'Focus on how the loop boundary index evaluates on each repetition cycle.'
      );
      setHintsUsed((prev) => ({ ...prev, [currentQuestion.id]: true }));
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleNext = () => {
    if (!quest) return;
    setAiHint(null);
    if (currentQuestionIdx < quest.questions.length - 1) {
      setCurrentQuestionIdx((idx) => idx + 1);
    } else {
      handleSubmitQuest();
    }
  };

  const handleSubmitQuest = async () => {
    if (!quest) return;

    // Calculate score
    let correctCount = 0;
    quest.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quest.questions.length) * 100);
    const isPassed = calculatedScore >= 60;
    const finalXp = isPassed ? quest.xpReward : 0;
    const finalGold = isPassed ? (quest.goldReward || 40) : 0;

    setScore(calculatedScore);
    setXpEarned(finalXp);
    setGoldEarned(finalGold);

    // Apply progression update in Demo Mode
    if (isDemo || demoStorage.isDemoActive()) {
      if (isPassed) {
        demoStorage.completeQuest(quest.id, finalXp, finalGold);
        await refreshUser();
      }
    } else {
      // Real API Submission
      try {
        await api.post(`/quests/${id}/submit`, {
          answers,
          hintsUsedCount: Object.keys(hintsUsed).length,
        });
        await refreshUser();
      } catch (err) {
        console.warn('Backend submit unreachable. Saved to local demo state.', err);
        if (isPassed) {
          demoStorage.completeQuest(quest.id, finalXp, finalGold);
          await refreshUser();
        }
      }
    }

    setIsCompleted(true);
  };

  if (isLoading) {
    return <PageLoader message="Loading Quest Encounter..." />;
  }

  if (!quest || !quest.questions || quest.questions.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">Quest Unavailable</h2>
        <p className="text-xs text-[var(--text-muted)]">This trial does not exist in the current chapter of the realm.</p>
        <Link href="/quests">
          <Button variant="primary" size="md">
            Return to Quest Board
          </Button>
        </Link>
      </div>
    );
  }

  const currentQuestion = quest.questions[currentQuestionIdx];
  const selectedAnswer = answers[currentQuestion.id] || '';
  const progressPercent = Math.round(((currentQuestionIdx) / quest.questions.length) * 100);

  // ─── 1. QUEST BRIEFING / INTRO SCREEN ──────────────────────────────────────
  if (!isPlaying) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in pb-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs">
          <Link href="/quests" className="text-[var(--text-accent)] hover:underline flex items-center gap-1 font-semibold">
            ← Back to Quest Board
          </Link>
          <span className="font-mono text-[var(--text-muted)]">
            Stage {quest.stage || 1} • {quest.regionName || 'Python Realm'}
          </span>
        </div>

        {/* Quest Briefing Panel */}
        <div className="devkit-panel p-6 sm:p-8 rounded-3xl border-[var(--primary-border)] bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-elevated)] to-[var(--bg-surface)] shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <DifficultyBadge difficulty={quest.difficulty} />
                <QuestTypeBadge type={quest.type} />
                <Badge variant="accent">{quest.regionName}</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-[var(--text-primary)]">
                {quest.title}
              </h1>
            </div>

            <div className="text-right sm:text-right bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)] shrink-0">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Victory Reward</div>
              <div className="text-lg font-black text-[var(--text-gold)]">
                +{quest.xpReward} XP • +{quest.goldReward || 40}g
              </div>
            </div>
          </div>

          {/* Narrative & Lore */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono text-[var(--text-accent)] uppercase tracking-wider">
              📜 Mission Briefing & Lore
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic bg-[var(--bg-void)] p-4 rounded-xl border border-[var(--border-subtle)]">
              "{quest.storyIntro || quest.description}"
            </p>
          </div>

          {/* Objectives */}
          {quest.objectives && quest.objectives.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase tracking-wider">
                🎯 Core Objectives
              </h3>
              <ul className="space-y-1.5">
                {quest.objectives.map((obj, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="text-[var(--text-accent)] font-bold">▶</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Encounter Specs */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Questions</div>
              <div className="font-bold text-[var(--text-primary)]">{quest.questions.length} Challenges</div>
            </div>
            <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Rec. Level</div>
              <div className="font-bold text-[var(--text-cyan)]">Lvl {quest.recommendedLevel || 5}</div>
            </div>
            <div className="bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">AI Guide</div>
              <div className="font-bold text-[var(--text-gold)]">AXIOM Enabled</div>
            </div>
          </div>

          {/* Primary Launch Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-default)]">
            <Link href={`/regions/${quest.regionSlug || 'logic-forest'}`} className="text-xs text-[var(--text-muted)] hover:underline">
              ← Return to Region Hub
            </Link>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsPlaying(true)}
              className="w-full sm:w-auto font-bold tracking-wide shadow-[0_0_24px_var(--primary-glow)]"
            >
              ⚔️ Begin Quest Now →
            </Button>
          </div>

        </div>

      </div>
    );
  }

  // ─── 2. ACTIVE QUESTION RUNNER ─────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 relative animate-fade-in pb-12">
      
      {/* Top Question Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <button
          onClick={() => setIsPlaying(false)}
          className="btn btn-ghost btn-sm text-xs flex items-center gap-1 w-fit"
        >
          🚪 Abandon Encounter
        </button>

        <div className="flex items-center gap-3">
          <span className="font-bold text-[var(--text-accent)] font-mono">
            {quest.title}
          </span>
          <span className="text-[var(--text-muted)] font-mono">
            Question {currentQuestionIdx + 1} / {quest.questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-[var(--bg-void)] overflow-hidden border border-[var(--border-subtle)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-500)] transition-all duration-500"
          style={{ width: `${Math.max(progressPercent, 10)}%` }}
        />
      </div>

      {/* MCQ Question Component */}
      <MCQQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onSelect={handleSelectAnswer}
        showFeedback={showFeedback}
      />

      {/* AXIOM AI Companion & Action Footer */}
      <div className="space-y-4">
        
        {/* AXIOM Socratic Hint Box */}
        {aiHint && (
          <div className="devkit-card bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.25)] p-4 rounded-2xl space-y-2 animate-fade-in-up">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-cyan)]">
              <span>🤖</span> AXIOM Socratic Companion:
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{aiHint}</p>
            <div className="text-[10px] text-[var(--text-gold)] italic">
              * Hint retrieved from mentor knowledge base.
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Ask AXIOM button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoadingHint || showFeedback}
            onClick={handleFetchAiHint}
            className="text-xs border-[var(--accent-border)] hover:bg-[var(--accent-subtle)]"
          >
            {isLoadingHint ? 'AXIOM is evaluating...' : '💡 Request AXIOM Hint'}
          </Button>

          {/* Progression Step Buttons */}
          <div className="flex gap-2">
            {!showFeedback ? (
              <Button
                variant="primary"
                size="md"
                disabled={!selectedAnswer}
                onClick={() => setShowFeedback(true)}
                className="w-full sm:w-auto font-bold"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setShowFeedback(false);
                  handleNext();
                }}
                className="w-full sm:w-auto font-bold shadow-[0_0_16px_var(--primary-glow)]"
              >
                {currentQuestionIdx < quest.questions.length - 1 ? 'Next Challenge →' : 'Complete Quest 🏆'}
              </Button>
            )}
          </div>
        </div>

      </div>

      {/* Victory Celebration Modal */}
      {isCompleted && (
        <QuestComplete
          questTitle={quest.title}
          xpEarned={xpEarned}
          goldEarned={goldEarned}
          materialDrops={quest.materialDrops}
          score={score}
          regionSlug={quest.regionSlug}
        />
      )}

    </div>
  );
}
