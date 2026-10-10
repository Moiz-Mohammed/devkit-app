/**
 * lib/progression.ts — DEVKIT Centralized Progression Engine
 *
 * Single authoritative source of derived state for:
 * - Quest status (completed / active / available / locked)
 * - Region status (completed / active / available / locked)
 * - Lesson status (completed / active / available / locked)
 * - Challenge / Practice status (completed / active / available / locked)
 * - Region lesson, quest, and challenge progress percentages
 * - Dynamic unlock calculations
 */

import type { User } from '@/types';
import { QUESTS, REGIONS, GameQuest, RegionData, getQuestById, getQuestsByRegion } from '@/lib/gameData';
import { LESSONS, GameLesson, getAllLessons, getLessonById, getLessonsByRegion } from '@/lib/learningData';
import { CHALLENGES, PracticeChallenge, getAllChallenges, getChallengeById, getChallengesByRegion } from '@/lib/practiceData';
import { DEMO_GAME_STATE, DemoGameState } from '@/lib/demo';

export type EntityStatus = 'completed' | 'active' | 'available' | 'locked';

// ─── 1. PREREQUISITE DEFINITIONS ─────────────────────────────────────────────

export const QUEST_PREREQUISITES: Record<string, string[]> = {
  'quest-intro': [],
  'quest-vars': ['quest-intro'],
  'quest-conditionals': ['quest-vars'],
  'quest-loops': ['quest-conditionals'],
  'quest-nested-loops': ['quest-loops'],
  'quest-boss-debugger': ['quest-nested-loops'],
};

export const LESSON_PREREQUISITES: Record<string, string[]> = {
  'lesson-first-steps': [],
  'lesson-vars-power': ['lesson-first-steps'],
  'lesson-input-gate': ['lesson-vars-power'],
  'lesson-boolean-shrine': ['lesson-input-gate'],
  'lesson-looping-path': ['lesson-boolean-shrine'],
  'lesson-nested-labyrinth': ['lesson-looping-path'],
};

export const CHALLENGE_PREREQUISITES: Record<string, string[]> = {
  'challenge-print-rite': [],
  'challenge-variable-forge': ['challenge-print-rite'],
  'challenge-input-gate': ['challenge-variable-forge'],
  'challenge-boolean-trial': ['challenge-input-gate'],
  'challenge-loop-trial': ['challenge-boolean-trial'],
  'challenge-nested-labyrinth': ['challenge-loop-trial'],
};

export const REGION_PREREQUISITES: Record<string, { requiredQuests: string[]; minLevel: number }> = {
  'python-village': { requiredQuests: [], minLevel: 1 },
  'logic-forest': { requiredQuests: ['quest-vars'], minLevel: 4 },
  'function-wastes': { requiredQuests: ['quest-boss-debugger'], minLevel: 8 },
  'data-mines': { requiredQuests: ['function-wastes'], minLevel: 13 },
  'oop-citadel': { requiredQuests: ['data-mines'], minLevel: 19 },
  'python-summit': { requiredQuests: ['oop-citadel'], minLevel: 26 },
};

// ─── 2. HELPER EXTRACTORS ────────────────────────────────────────────────────

function getPlayerGameState(user: User | null): DemoGameState {
  return (user as { gameState?: DemoGameState })?.gameState || DEMO_GAME_STATE;
}

export function getCompletedQuestIds(user: User | null): string[] {
  const gs = getPlayerGameState(user);
  return gs.completedQuestIds || [];
}

export function getCompletedLessonIds(user: User | null): string[] {
  const gs = getPlayerGameState(user);
  return gs.completedLessonIds || ['lesson-first-steps', 'lesson-vars-power'];
}

export function getCompletedChallengeIds(user: User | null): string[] {
  const gs = getPlayerGameState(user);
  return gs.completedChallengeIds || ['challenge-print-rite', 'challenge-variable-forge'];
}

// ─── 3. QUEST STATUS CALCULATION ─────────────────────────────────────────────

export function getQuestStatus(user: User | null, questId: string): EntityStatus {
  const completedIds = getCompletedQuestIds(user);
  const currentQuestId = getPlayerGameState(user).currentQuestId;

  // 1. If already in completed list
  if (completedIds.includes(questId)) {
    return 'completed';
  }

  // 2. Check prerequisites
  const prereqs = QUEST_PREREQUISITES[questId] || [];
  const arePrereqsMet = prereqs.every((prereqId) => completedIds.includes(prereqId));

  if (!arePrereqsMet) {
    return 'locked';
  }

  // 3. If prerequisites are met:
  if (questId === currentQuestId) {
    return 'active';
  }

  return 'available';
}

// ─── 4. LESSON STATUS CALCULATION ────────────────────────────────────────────

export function getLessonStatus(user: User | null, lessonId: string): EntityStatus {
  const completedIds = getCompletedLessonIds(user);

  // 1. If already completed
  if (completedIds.includes(lessonId)) {
    return 'completed';
  }

  // 2. Check prerequisites
  const prereqs = LESSON_PREREQUISITES[lessonId] || [];
  const arePrereqsMet = prereqs.every((prereqId) => completedIds.includes(prereqId));

  if (!arePrereqsMet) {
    return 'locked';
  }

  // 3. Check if active
  const activeLesson = getCurrentActiveLesson(user);
  if (activeLesson?.id === lessonId) {
    return 'active';
  }

  return 'available';
}

// ─── 5. CHALLENGE / PRACTICE STATUS CALCULATION ──────────────────────────────

export function getChallengeStatus(user: User | null, challengeId: string): EntityStatus {
  const completedIds = getCompletedChallengeIds(user);

  // 1. If already completed
  if (completedIds.includes(challengeId)) {
    return 'completed';
  }

  // 2. Check prerequisites
  const prereqs = CHALLENGE_PREREQUISITES[challengeId] || [];
  const arePrereqsMet = prereqs.every((prereqId) => completedIds.includes(prereqId));

  if (!arePrereqsMet) {
    return 'locked';
  }

  // 3. Check if active
  const activeChallenge = getCurrentActiveChallenge(user);
  if (activeChallenge?.id === challengeId) {
    return 'active';
  }

  return 'available';
}

// ─── 6. REGION CHALLENGE PROGRESS CALCULATION ────────────────────────────────

export interface RegionChallengeProgressSummary {
  totalChallenges: number;
  completedChallenges: number;
  pct: number;
  isFullyCleared: boolean;
}

export function getRegionChallengeProgress(user: User | null, regionSlug: string): RegionChallengeProgressSummary {
  const challenges = getChallengesByRegion(regionSlug);
  const completedIds = getCompletedChallengeIds(user);

  const totalChallenges = challenges.length;
  const completedChallenges = challenges.filter((c) => completedIds.includes(c.id)).length;
  const pct = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
  const isFullyCleared = totalChallenges > 0 && completedChallenges === totalChallenges;

  return {
    totalChallenges,
    completedChallenges,
    pct,
    isFullyCleared,
  };
}

// ─── 7. REGION LESSON PROGRESS CALCULATION ───────────────────────────────────

export interface RegionLessonProgressSummary {
  totalLessons: number;
  completedLessons: number;
  pct: number;
  isFullyCleared: boolean;
}

export function getRegionLessonProgress(user: User | null, regionSlug: string): RegionLessonProgressSummary {
  const lessons = getLessonsByRegion(regionSlug);
  const completedIds = getCompletedLessonIds(user);

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => completedIds.includes(l.id)).length;
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isFullyCleared = totalLessons > 0 && completedLessons === totalLessons;

  return {
    totalLessons,
    completedLessons,
    pct,
    isFullyCleared,
  };
}

// ─── 8. REGION STATUS & QUEST PROGRESS CALCULATION ───────────────────────────

export interface RegionProgressSummary {
  totalQuests: number;
  completedQuests: number;
  pct: number;
  isFullyCleared: boolean;
  status: EntityStatus;
}

export function getRegionQuestProgress(user: User | null, regionSlug: string): RegionProgressSummary {
  const quests = getQuestsByRegion(regionSlug);
  const completedIds = getCompletedQuestIds(user);

  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => completedIds.includes(q.id)).length;
  const pct = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
  const isFullyCleared = totalQuests > 0 && completedQuests === totalQuests;

  const status = getRegionStatus(user, regionSlug);

  return {
    totalQuests,
    completedQuests,
    pct,
    isFullyCleared,
    status,
  };
}

export function getRegionStatus(user: User | null, regionSlug: string): EntityStatus {
  const completedIds = getCompletedQuestIds(user);
  const gs = getPlayerGameState(user);

  const questsInRegion = getQuestsByRegion(regionSlug);

  // 1. Check if all quests in region are completed
  if (questsInRegion.length > 0 && questsInRegion.every((q) => completedIds.includes(q.id))) {
    return 'completed';
  }

  // 2. Check region prerequisites
  const prereqConfig = REGION_PREREQUISITES[regionSlug];
  if (prereqConfig) {
    const questsMet = prereqConfig.requiredQuests.every((qId) => completedIds.includes(qId));
    const isExplicitlyUnlocked = gs.unlockedRegions?.includes(
      REGIONS.find((r) => r.slug === regionSlug)?.name || ''
    );

    if (!questsMet && !isExplicitlyUnlocked) {
      return 'locked';
    }
  }

  // 3. If player is currently inside this region
  const regionName = REGIONS.find((r) => r.slug === regionSlug)?.name;
  if (gs.currentRegion === regionName || (regionSlug === 'logic-forest' && !questsInRegion.every((q) => completedIds.includes(q.id)))) {
    return 'active';
  }

  return 'available';
}

// ─── 9. DERIVED REALM SNAPSHOT ───────────────────────────────────────────────

export interface SynchronizedRegionView extends RegionData {
  dynamicStatus: EntityStatus;
  completedQuestsCount: number;
  totalQuestsCount: number;
  progressPct: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  lessonProgressPct: number;
  completedChallengesCount: number;
  totalChallengesCount: number;
  challengeProgressPct: number;
}

export function getSynchronizedRegions(user: User | null): SynchronizedRegionView[] {
  return REGIONS.map((region) => {
    const questSummary = getRegionQuestProgress(user, region.slug);
    const lessonSummary = getRegionLessonProgress(user, region.slug);
    const challengeSummary = getRegionChallengeProgress(user, region.slug);

    return {
      ...region,
      dynamicStatus: questSummary.status,
      completedQuestsCount: questSummary.completedQuests,
      totalQuestsCount: questSummary.totalQuests,
      progressPct: questSummary.pct,
      completedLessonsCount: lessonSummary.completedLessons,
      totalLessonsCount: lessonSummary.totalLessons,
      lessonProgressPct: lessonSummary.pct,
      completedChallengesCount: challengeSummary.completedChallenges,
      totalChallengesCount: challengeSummary.totalChallenges,
      challengeProgressPct: challengeSummary.pct,
    };
  });
}

// ─── 10. DYNAMIC ACTIVE SELECTORS ────────────────────────────────────────────

export function getCurrentActiveQuest(user: User | null): GameQuest {
  const completedIds = getCompletedQuestIds(user);

  // Find the first uncompleted quest whose prerequisites are met
  for (const quest of QUESTS) {
    if (!completedIds.includes(quest.id)) {
      const prereqs = QUEST_PREREQUISITES[quest.id] || [];
      if (prereqs.every((p) => completedIds.includes(p))) {
        return quest;
      }
    }
  }

  // If all completed, default to the boss quest or last quest
  return QUESTS[QUESTS.length - 1];
}

export function getCurrentActiveLesson(user: User | null): GameLesson {
  const completedIds = getCompletedLessonIds(user);

  // Find the first uncompleted lesson whose prerequisites are met
  for (const lesson of LESSONS) {
    if (!completedIds.includes(lesson.id)) {
      const prereqs = LESSON_PREREQUISITES[lesson.id] || [];
      if (prereqs.every((p) => completedIds.includes(p))) {
        return lesson;
      }
    }
  }

  // If all completed, default to the last lesson
  return LESSONS[LESSONS.length - 1];
}

export function getCurrentActiveChallenge(user: User | null): PracticeChallenge {
  const completedIds = getCompletedChallengeIds(user);

  // Find the first uncompleted challenge whose prerequisites are met
  for (const challenge of CHALLENGES) {
    if (!completedIds.includes(challenge.id)) {
      const prereqs = CHALLENGE_PREREQUISITES[challenge.id] || [];
      if (prereqs.every((p) => completedIds.includes(p))) {
        return challenge;
      }
    }
  }

  // If all completed, default to the last challenge
  return CHALLENGES[CHALLENGES.length - 1];
}
