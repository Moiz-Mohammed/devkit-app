/**
 * lib/demo.ts — DEVKIT Demo Mode State Management
 *
 * Isolated demo mode abstraction for offline prototype showcase.
 * Provides a mock player state without compromising real JWT auth.
 */

import Cookies from 'js-cookie';
import type { User } from '@/types';
import { xpToLevel, xpToNextLevel } from '@/lib/utils';

export const DEMO_COOKIE_KEY = 'devkit_demo_mode';
export const DEMO_USER_STORAGE_KEY = 'devkit_demo_user';

export interface DemoGameState {
  gold: number;
  completedQuestsCount: number;
  completedQuestIds: string[];
  completedLessonIds: string[];
  completedChallengeIds?: string[];
  challengeAttempts?: Record<string, number>;
  challengeBestScores?: Record<string, number>;
  currentQuest: string;
  currentQuestId: string;
  currentRegion: string;
  unlockedRegions: string[];
  lockedRegions: string[];
}

export const INITIAL_DEMO_GAME_STATE: DemoGameState = {
  gold: 420,
  completedQuestsCount: 3,
  completedQuestIds: ['quest-intro', 'quest-vars', 'quest-conditionals'],
  completedLessonIds: ['lesson-first-steps', 'lesson-vars-power'],
  completedChallengeIds: ['challenge-print-rite', 'challenge-variable-forge'],
  challengeAttempts: { 'challenge-print-rite': 1, 'challenge-variable-forge': 1 },
  challengeBestScores: { 'challenge-print-rite': 100, 'challenge-variable-forge': 100 },
  currentQuest: 'The Loop Trial',
  currentQuestId: 'quest-loops',
  currentRegion: 'Logic Forest',
  unlockedRegions: ['Python Village', 'Logic Forest'],
  lockedRegions: ['Function Wastes', 'Data Mines', 'OOP Citadel', 'Python Summit'],
};

export const INITIAL_DEMO_USER: User & { gameState: DemoGameState } = {
  id: 'demo-user-moiz',
  email: 'moiz@devkit.dev',
  username: 'Moiz',
  isAdmin: false,
  createdAt: new Date().toISOString(),
  character: {
    id: 'demo-char-moiz',
    userId: 'demo-user-moiz',
    classId: 'class-python-dev',
    class: {
      id: 'class-python-dev',
      name: 'Python Developer',
      slug: 'python-developer',
      description: 'Master of indentation, data flow, and algorithmic spellcraft.',
      icon: '🐍',
      primaryColor: '#06b6d4',
    },
    evolutionStage: 2, // Apprentice
    primaryWeaponId: 'weapon-python-blade',
  },
  xp: {
    id: 'demo-xp-moiz',
    userId: 'demo-user-moiz',
    totalXP: 680,
    level: 7,
    xpToNext: 320,
  },
  streak: {
    id: 'demo-streak-moiz',
    userId: 'demo-user-moiz',
    currentStreak: 5,
    longestStreak: 12,
    lastActiveAt: new Date().toISOString(),
  },
  gameState: INITIAL_DEMO_GAME_STATE,
};

export const DEMO_GAME_STATE = INITIAL_DEMO_GAME_STATE;
export const DEMO_USER = INITIAL_DEMO_USER;

let memoryDemoUser: (User & { gameState: DemoGameState }) | null = null;

export const demoStorage = {
  isDemoActive: (): boolean => {
    if (typeof window === 'undefined') return memoryDemoUser !== null;
    return Cookies.get(DEMO_COOKIE_KEY) === 'true' || localStorage.getItem(DEMO_COOKIE_KEY) === 'true';
  },

  enableDemo: (): User => {
    Cookies.set(DEMO_COOKIE_KEY, 'true', { expires: 7, sameSite: 'strict' });
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_COOKIE_KEY, 'true');
      const existing = localStorage.getItem(DEMO_USER_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USER));
        memoryDemoUser = INITIAL_DEMO_USER;
        return INITIAL_DEMO_USER;
      }
      try {
        const parsed = JSON.parse(existing);
        memoryDemoUser = parsed;
        return parsed;
      } catch {
        localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USER));
        memoryDemoUser = INITIAL_DEMO_USER;
        return INITIAL_DEMO_USER;
      }
    }
    memoryDemoUser = INITIAL_DEMO_USER;
    return INITIAL_DEMO_USER;
  },

  getDemoUser: (): (User & { gameState: DemoGameState }) | null => {
    if (typeof window === 'undefined') return memoryDemoUser || INITIAL_DEMO_USER;
    if (!demoStorage.isDemoActive()) return null;
    const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (!stored) return memoryDemoUser || INITIAL_DEMO_USER;
    try {
      return JSON.parse(stored);
    } catch {
      return memoryDemoUser || INITIAL_DEMO_USER;
    }
  },

  saveDemoUser: (updatedUser: User & { gameState: DemoGameState }) => {
    memoryDemoUser = updatedUser;
    if (typeof window === 'undefined') return;
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(updatedUser));
  },

  completeQuest: (questId: string, xpEarned: number, goldEarned: number): User & { gameState: DemoGameState } => {
    const current = demoStorage.getDemoUser() || INITIAL_DEMO_USER;
    const currentCompletedIds = current.gameState?.completedQuestIds || [];

    const isFirstTime = !currentCompletedIds.includes(questId);
    const updatedCompletedIds = isFirstTime ? [...currentCompletedIds, questId] : currentCompletedIds;
    const newCompletedCount = updatedCompletedIds.length;

    const newTotalXP = (current.xp?.totalXP || 0) + xpEarned;
    const newLevel = Math.max(current.xp?.level || 1, xpToLevel(newTotalXP));
    const newXpToNext = xpToNextLevel(newTotalXP);

    const newGold = (current.gameState?.gold || 0) + goldEarned;

    // Progression Unlock Rules
    const unlockedRegions = [...(current.gameState?.unlockedRegions || ['Python Village', 'Logic Forest'])];
    const lockedRegions = [...(current.gameState?.lockedRegions || ['Function Wastes', 'Data Mines', 'OOP Citadel', 'Python Summit'])];

    // If boss defeated, unlock Function Wastes
    if (questId === 'quest-boss-debugger' && !unlockedRegions.includes('Function Wastes')) {
      unlockedRegions.push('Function Wastes');
      const idx = lockedRegions.indexOf('Function Wastes');
      if (idx !== -1) lockedRegions.splice(idx, 1);
    }

    // Progression active quest sequence
    let nextQuestName = current.gameState?.currentQuest || 'The Loop Trial';
    let nextQuestId = current.gameState?.currentQuestId || 'quest-loops';

    if (questId === 'quest-loops') {
      nextQuestName = 'Nested Loop Labyrinth';
      nextQuestId = 'quest-nested-loops';
    } else if (questId === 'quest-nested-loops') {
      nextQuestName = 'Dungeon Boss: The Debugger';
      nextQuestId = 'quest-boss-debugger';
    } else if (questId === 'quest-boss-debugger') {
      nextQuestName = 'Function Wastes Initiation';
      nextQuestId = 'quest-functions-intro';
    }

    const updatedUser: User & { gameState: DemoGameState } = {
      ...current,
      xp: {
        id: current.xp?.id || 'demo-xp-moiz',
        userId: current.id,
        totalXP: newTotalXP,
        level: newLevel,
        xpToNext: newXpToNext,
      },
      gameState: {
        ...current.gameState,
        gold: newGold,
        completedQuestsCount: newCompletedCount,
        completedQuestIds: updatedCompletedIds,
        completedLessonIds: current.gameState?.completedLessonIds || ['lesson-first-steps', 'lesson-vars-power'],
        currentQuest: nextQuestName,
        currentQuestId: nextQuestId,
        unlockedRegions,
        lockedRegions,
      },
    };

    demoStorage.saveDemoUser(updatedUser);
    return updatedUser;
  },

  completeLesson: (lessonId: string, xpEarned: number, goldEarned: number): User & { gameState: DemoGameState } => {
    const current = demoStorage.getDemoUser() || INITIAL_DEMO_USER;
    const currentCompletedLessons = current.gameState?.completedLessonIds || [];

    const isFirstTime = !currentCompletedLessons.includes(lessonId);
    const updatedCompletedLessons = isFirstTime ? [...currentCompletedLessons, lessonId] : currentCompletedLessons;

    const newTotalXP = (current.xp?.totalXP || 0) + xpEarned;
    const newLevel = Math.max(current.xp?.level || 1, xpToLevel(newTotalXP));
    const newXpToNext = xpToNextLevel(newTotalXP);

    const newGold = (current.gameState?.gold || 0) + goldEarned;

    const updatedUser: User & { gameState: DemoGameState } = {
      ...current,
      xp: {
        id: current.xp?.id || 'demo-xp-moiz',
        userId: current.id,
        totalXP: newTotalXP,
        level: newLevel,
        xpToNext: newXpToNext,
      },
      gameState: {
        ...current.gameState,
        gold: newGold,
        completedLessonIds: updatedCompletedLessons,
        completedChallengeIds: current.gameState?.completedChallengeIds || ['challenge-print-rite', 'challenge-variable-forge'],
        challengeAttempts: current.gameState?.challengeAttempts || {},
        challengeBestScores: current.gameState?.challengeBestScores || {},
        completedQuestIds: current.gameState?.completedQuestIds || [],
        completedQuestsCount: current.gameState?.completedQuestsCount || 0,
        currentQuest: current.gameState?.currentQuest || 'The Loop Trial',
        currentQuestId: current.gameState?.currentQuestId || 'quest-loops',
        currentRegion: current.gameState?.currentRegion || 'Logic Forest',
        unlockedRegions: current.gameState?.unlockedRegions || ['Python Village', 'Logic Forest'],
        lockedRegions: current.gameState?.lockedRegions || ['Function Wastes', 'Data Mines', 'OOP Citadel', 'Python Summit'],
      },
    };

    demoStorage.saveDemoUser(updatedUser);
    return updatedUser;
  },

  completeChallenge: (challengeId: string, xpEarned: number, goldEarned: number, score: number = 100): User & { gameState: DemoGameState } => {
    const current = demoStorage.getDemoUser() || INITIAL_DEMO_USER;
    const currentCompletedChallenges = current.gameState?.completedChallengeIds || [];
    const currentAttempts = current.gameState?.challengeAttempts || {};
    const currentBestScores = current.gameState?.challengeBestScores || {};

    const isFirstTime = !currentCompletedChallenges.includes(challengeId);
    const updatedCompletedChallenges = isFirstTime ? [...currentCompletedChallenges, challengeId] : currentCompletedChallenges;

    const newAttempts = {
      ...currentAttempts,
      [challengeId]: (currentAttempts[challengeId] || 0) + 1,
    };

    const newBestScores = {
      ...currentBestScores,
      [challengeId]: Math.max(currentBestScores[challengeId] || 0, score),
    };

    // Only award XP and Gold on first successful completion
    const newTotalXP = (current.xp?.totalXP || 0) + (isFirstTime ? xpEarned : 0);
    const newLevel = Math.max(current.xp?.level || 1, xpToLevel(newTotalXP));
    const newXpToNext = xpToNextLevel(newTotalXP);
    const newGold = (current.gameState?.gold || 0) + (isFirstTime ? goldEarned : 0);

    const updatedUser: User & { gameState: DemoGameState } = {
      ...current,
      xp: {
        id: current.xp?.id || 'demo-xp-moiz',
        userId: current.id,
        totalXP: newTotalXP,
        level: newLevel,
        xpToNext: newXpToNext,
      },
      gameState: {
        ...current.gameState,
        gold: newGold,
        completedChallengeIds: updatedCompletedChallenges,
        challengeAttempts: newAttempts,
        challengeBestScores: newBestScores,
        completedLessonIds: current.gameState?.completedLessonIds || ['lesson-first-steps', 'lesson-vars-power'],
        completedQuestIds: current.gameState?.completedQuestIds || [],
        completedQuestsCount: current.gameState?.completedQuestsCount || 0,
        currentQuest: current.gameState?.currentQuest || 'The Loop Trial',
        currentQuestId: current.gameState?.currentQuestId || 'quest-loops',
        currentRegion: current.gameState?.currentRegion || 'Logic Forest',
        unlockedRegions: current.gameState?.unlockedRegions || ['Python Village', 'Logic Forest'],
        lockedRegions: current.gameState?.lockedRegions || ['Function Wastes', 'Data Mines', 'OOP Citadel', 'Python Summit'],
      },
    };

    demoStorage.saveDemoUser(updatedUser);
    return updatedUser;
  },

  recordChallengeAttempt: (challengeId: string, score: number = 0): User & { gameState: DemoGameState } => {
    const current = demoStorage.getDemoUser() || INITIAL_DEMO_USER;
    const currentAttempts = current.gameState?.challengeAttempts || {};
    const currentBestScores = current.gameState?.challengeBestScores || {};

    const newAttempts = {
      ...currentAttempts,
      [challengeId]: (currentAttempts[challengeId] || 0) + 1,
    };

    const newBestScores = {
      ...currentBestScores,
      [challengeId]: Math.max(currentBestScores[challengeId] || 0, score),
    };

    const updatedUser: User & { gameState: DemoGameState } = {
      ...current,
      gameState: {
        ...current.gameState,
        challengeAttempts: newAttempts,
        challengeBestScores: newBestScores,
      },
    };

    demoStorage.saveDemoUser(updatedUser);
    return updatedUser;
  },

  clearDemo: () => {
    Cookies.remove(DEMO_COOKIE_KEY);
    localStorage.removeItem(DEMO_COOKIE_KEY);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
  },
};
