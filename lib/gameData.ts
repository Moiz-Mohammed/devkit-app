/**
 * lib/gameData.ts — DEVKIT Python Realm Game Content
 *
 * Centralized static content library for regions, quests, and questions.
 * Decoupled from player progression state (which lives in lib/demo.ts / AuthContext).
 */

import type { Quest, QuestQuestion } from '@/types';

export interface GameQuestQuestion extends QuestQuestion {
  tag?: string;
}

export interface GameQuest extends Quest {
  regionSlug: string;
  regionName: string;
  recommendedLevel: number;
  stage: number;
  goldReward: number;
  storyIntro: string;
  objectives: string[];
  questions: GameQuestQuestion[];
}

export interface RegionData {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  icon: string;
  recommendedLevel: string;
  description: string;
  lore: string;
  status: 'completed' | 'active' | 'available' | 'locked';
  bossName: string;
  bossDifficulty: 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'boss';
  bannerBg: string;
}

// ─── 1. PYTHON REALM REGIONS ─────────────────────────────────────────────────

export const REGIONS: RegionData[] = [
  {
    id: 'region-python-village',
    slug: 'python-village',
    name: 'Python Village',
    subtitle: 'The Peaceful Starting Sanctuary',
    icon: '🏡',
    recommendedLevel: 'Lvl 01 - 03',
    description: 'The green cradle where every coder begins their journey. Streets lined with basic variable stores and standard output shrines.',
    lore: 'Centuries ago, ancient developer monks forged the first indentation rules in this peaceful haven. Here, novices take their first steps in Python spellcraft without fear of syntax dragons.',
    status: 'completed',
    bossName: 'None (Safe Sanctuary)',
    bossDifficulty: 'novice',
    bannerBg: 'from-emerald-950/40 via-[var(--bg-surface)] to-[var(--bg-surface)]',
  },
  {
    id: 'region-logic-forest',
    slug: 'logic-forest',
    name: 'Logic Forest',
    subtitle: 'The Canopy of Branching Conditions & Loops',
    icon: '🌲',
    recommendedLevel: 'Lvl 04 - 07',
    description: 'A dense, shifting woodland of Boolean expressions, nested conditionals, and while-loop groves where sentinels guard the gate to Function Wastes.',
    lore: 'The trees of this forest grow in binary branches. One false assumption in your truth tables, and the paths twist into infinite loops. Master the iterative rites to pass through unharmed.',
    status: 'active',
    bossName: 'The Debugger',
    bossDifficulty: 'boss',
    bannerBg: 'from-emerald-900/30 via-violet-950/20 to-[var(--bg-surface)]',
  },
  {
    id: 'region-function-wastes',
    slug: 'function-wastes',
    name: 'Function Wastes',
    subtitle: 'Canyons of Modular Architecture',
    icon: '⚡',
    recommendedLevel: 'Lvl 08 - 12',
    description: 'Arid crystalline canyons where arguments are passed, scopes are bound, and return values resonate.',
    lore: 'In these high mesas, code duplication is considered heresy. Master architects carve reusable functions into stone pillars that stand for millennia.',
    status: 'locked',
    bossName: 'Stack Overflow Wraith',
    bossDifficulty: 'expert',
    bannerBg: 'from-amber-950/30 via-[var(--bg-surface)] to-[var(--bg-surface)]',
  },
  {
    id: 'region-data-mines',
    slug: 'data-mines',
    name: 'Data Mines',
    subtitle: 'Subterranean Vaults of Structure',
    icon: '💎',
    recommendedLevel: 'Lvl 13 - 18',
    description: 'Deep diamond-encrusted shafts holding lists, dicts, tuples, and sets. High-velocity slicing is needed to excavate the treasure.',
    lore: 'The dwarves of DEVKIT dug too greedily into nested hash maps. Now, KeyError monsters guard the deepest data veins.',
    status: 'locked',
    bossName: 'KeyError Behemoth',
    bossDifficulty: 'expert',
    bannerBg: 'from-cyan-950/30 via-[var(--bg-surface)] to-[var(--bg-surface)]',
  },
  {
    id: 'region-oop-citadel',
    slug: 'oop-citadel',
    name: 'OOP Citadel',
    subtitle: 'Monolith of Class Hierarchies',
    icon: '🏰',
    recommendedLevel: 'Lvl 19 - 25',
    description: 'A towering fortress of inheritance, encapsulation, and polymorphism. Only true architects dare ascend its towers.',
    lore: 'Every stone in the Citadel inherits from the foundational Object Class. Polymorphic spells shift form at runtime to defend against spaghetti code invaders.',
    status: 'locked',
    bossName: 'The Monolithic Titan',
    bossDifficulty: 'boss',
    bannerBg: 'from-purple-950/30 via-[var(--bg-surface)] to-[var(--bg-surface)]',
  },
  {
    id: 'region-python-summit',
    slug: 'python-summit',
    name: 'Python Summit',
    subtitle: 'The Pinnacle of Legendary Masters',
    icon: '🌋',
    recommendedLevel: 'Lvl 26+',
    description: 'The sky-piercing volcanic peak where asynchronous master wizards and metaclass dragons battle for the ultimate crown.',
    lore: 'The birthplace of DEVKIT. Legends say Guido’s Wyrm rests at the caldera, waiting for a champion whose code compiles without a single warning.',
    status: 'locked',
    bossName: 'Guido’s Wyrm',
    bossDifficulty: 'boss',
    bannerBg: 'from-red-950/40 via-[var(--bg-surface)] to-[var(--bg-surface)]',
  },
];

// ─── 2. PYTHON REALM QUESTS ──────────────────────────────────────────────────

export const QUESTS: GameQuest[] = [
  // ── PYTHON VILLAGE QUESTS ──
  {
    id: 'quest-intro',
    topicId: 'topic-basics',
    title: 'The First Print Rite',
    regionSlug: 'python-village',
    regionName: 'Python Village',
    recommendedLevel: 1,
    stage: 1,
    type: 'study',
    difficulty: 'novice',
    xpReward: 35,
    goldReward: 10,
    orderIndex: 1,
    isBoss: false,
    description: 'Learn the sacred print statement, string output, and basic comment formatting in the Village sanctuary.',
    storyIntro: 'The Village Elder hands you your first parchment. Before you can wield advanced algorithms, you must master the fundamental rite of summoning text to the console.',
    objectives: [
      'Understand the print() built-in function',
      'Format single-line comments with #',
      'Execute your first clean console output',
    ],
    materialDrops: [{ id: 'm1', materialType: 'syntax_shards', amount: 3 }],
    questions: [
      {
        id: 'pv-q1',
        questId: 'quest-intro',
        question: 'What is the correct built-in function to output "Hello DEVKIT" to the terminal in Python?',
        questionType: 'mcq',
        options: [
          'print("Hello DEVKIT")',
          'echo("Hello DEVKIT")',
          'console.log("Hello DEVKIT")',
          'System.out.println("Hello DEVKIT")',
        ],
        correctAnswer: 'print("Hello DEVKIT")',
        explanation: 'Python uses the built-in print() function to write text to standard output. It automatically appends a newline unless specified otherwise.',
        orderIndex: 1,
        tag: 'Syntax Basics',
      },
      {
        id: 'pv-q2',
        questId: 'quest-intro',
        question: 'Which character begins a single-line comment in Python?',
        questionType: 'mcq',
        options: ['#', '//', '/*', '--'],
        correctAnswer: '#',
        explanation: 'The hash symbol (#) tells the Python interpreter to ignore everything that follows on that line.',
        orderIndex: 2,
        tag: 'Comments',
      },
    ],
  },
  {
    id: 'quest-vars',
    topicId: 'topic-basics',
    title: 'Variables of Power',
    regionSlug: 'python-village',
    regionName: 'Python Village',
    recommendedLevel: 2,
    stage: 2,
    type: 'study',
    difficulty: 'novice',
    xpReward: 45,
    goldReward: 15,
    orderIndex: 2,
    isBoss: false,
    description: 'Bind integers, floats, and strings into memory identifiers to store adventurer stats.',
    storyIntro: 'An adventurer must track their health, mana, and coin. In Python, variables dynamically bind names to values without explicit type declarations.',
    objectives: [
      'Assign integers and floating-point numbers',
      'Understand dynamic typing in Python',
      'Follow PEP8 variable naming conventions',
    ],
    materialDrops: [{ id: 'm2', materialType: 'syntax_shards', amount: 4 }],
    questions: [
      {
        id: 'pv-q3',
        questId: 'quest-vars',
        question: 'Which of the following is a valid Python variable assignment?',
        questionType: 'mcq',
        options: [
          'hero_hp = 100',
          'int hero_hp = 100;',
          'let hero_hp = 100',
          '$hero_hp = 100',
        ],
        correctAnswer: 'hero_hp = 100',
        explanation: 'Python is dynamically typed and does not require type keywords (like int or let) or semicolons. Variable names use snake_case by convention.',
        orderIndex: 1,
        tag: 'Variable Assignment',
      },
      {
        id: 'pv-q4',
        questId: 'quest-vars',
        question: 'What is the data type of `power_multiplier = 1.75` in Python?',
        questionType: 'mcq',
        options: ['float', 'int', 'double', 'Decimal'],
        correctAnswer: 'float',
        explanation: 'Numbers with fractional decimal points are automatically inferred as standard float instances in Python.',
        orderIndex: 2,
        tag: 'Data Types',
      },
    ],
  },

  // ── LOGIC FOREST QUESTS (MAIN PLAYABLE PROGRESSION) ──
  {
    id: 'quest-conditionals',
    topicId: 'topic-logic',
    title: 'The Boolean Shrine',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    recommendedLevel: 4,
    stage: 1,
    type: 'challenge',
    difficulty: 'apprentice',
    xpReward: 60,
    goldReward: 25,
    orderIndex: 3,
    isBoss: false,
    description: 'Master if, elif, and else conditional branching to navigate fork paths under the Forest canopy.',
    storyIntro: 'You arrive at the Boolean Shrine. Two pathways diverge into the mist: one leads to treasure, the other to a pit of syntax exceptions. Evaluate the conditions to choose wisely.',
    objectives: [
      'Evaluate Boolean expressions (and, or, not)',
      'Construct if-elif-else branching structures',
      'Understand strict indentation blocks in Python',
    ],
    materialDrops: [{ id: 'm3', materialType: 'logic_bolts', amount: 2 }],
    questions: [
      {
        id: 'lf-q1',
        questId: 'quest-conditionals',
        question: 'What will this code print?\n\nhp = 45\nif hp > 50:\n    print("Healthy")\nelif hp > 20:\n    print("Wounded")\nelse:\n    print("Fainted")',
        questionType: 'mcq',
        options: ['Wounded', 'Healthy', 'Fainted', 'SyntaxError'],
        correctAnswer: 'Wounded',
        explanation: 'hp is 45. The first condition (hp > 50) evaluates to False. The elif condition (45 > 20) evaluates to True, executing print("Wounded").',
        orderIndex: 1,
        tag: 'Conditionals',
      },
      {
        id: 'lf-q2',
        questId: 'quest-conditionals',
        question: 'What is the result of `True and not False` in Python?',
        questionType: 'mcq',
        options: ['True', 'False', 'None', 'Error'],
        correctAnswer: 'True',
        explanation: '`not False` evaluates to True. Then `True and True` evaluates to True.',
        orderIndex: 2,
        tag: 'Boolean Operators',
      },
    ],
  },
  {
    id: 'quest-loops',
    topicId: 'topic-logic',
    title: 'The Loop Trial',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    recommendedLevel: 5,
    stage: 2,
    type: 'challenge',
    difficulty: 'apprentice',
    xpReward: 120,
    goldReward: 60,
    orderIndex: 4,
    isBoss: false,
    description: 'Construct while and for loops to traverse repetitive sequence challenges and defeat the forest guardians.',
    storyIntro: 'Forest Sentinels spawn in repeating waves! A single manual command cannot stop them all. You must forge iterative loops to process collections and control execution flow.',
    objectives: [
      'Iterate over sequences using for-in loops',
      'Generate index sequences with range(start, stop, step)',
      'Prevent infinite loops by updating while loop predicates',
    ],
    materialDrops: [
      { id: 'm4', materialType: 'logic_bolts', amount: 4 },
      { id: 'm5', materialType: 'syntax_shards', amount: 6 },
    ],
    questions: [
      {
        id: 'lf-q3',
        questId: 'quest-loops',
        question: 'What numbers are generated by `range(2, 8, 2)`?',
        questionType: 'mcq',
        options: ['2, 4, 6', '2, 4, 6, 8', '2, 3, 4, 5, 6, 7', '0, 2, 4, 6'],
        correctAnswer: '2, 4, 6',
        explanation: 'range(start, stop, step) starts at 2, steps by 2 (yielding 2, 4, 6), and stops before reaching the stop boundary of 8.',
        orderIndex: 1,
        tag: 'Range Function',
      },
      {
        id: 'lf-q4',
        questId: 'quest-loops',
        question: 'How many times will this loop execute?\n\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1',
        questionType: 'mcq',
        options: ['3 times', '4 times', '2 times', 'Infinite loop'],
        correctAnswer: '3 times',
        explanation: 'The loop executes for count = 3, 2, and 1. When count decreases to 0, the condition (count > 0) becomes False and terminates.',
        orderIndex: 2,
        tag: 'While Loops',
      },
      {
        id: 'lf-q5',
        questId: 'quest-loops',
        question: 'Which loop is best suited for iterating over every item in a list `items = ["sword", "shield", "potion"]`?',
        questionType: 'mcq',
        options: [
          'for item in items:',
          'while items.hasNext():',
          'forEach item in items:',
          'loop items as item:',
        ],
        correctAnswer: 'for item in items:',
        explanation: 'Python uses the elegant `for element in iterable:` syntax to directly traverse items without needing manual index counters.',
        orderIndex: 3,
        tag: 'For-in Loops',
      },
    ],
  },
  {
    id: 'quest-nested-loops',
    topicId: 'topic-logic',
    title: 'Nested Loop Labyrinth',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    recommendedLevel: 6,
    stage: 3,
    type: 'challenge',
    difficulty: 'journeyman',
    xpReward: 150,
    goldReward: 80,
    orderIndex: 5,
    isBoss: false,
    description: 'Navigate 2D grid matrix puzzles using outer and inner loop iteration patterns.',
    storyIntro: 'The Labyrinth doors are locked with two-dimensional coordinate grids. You must nest an inner loop inside an outer loop to illuminate all rows and columns.',
    objectives: [
      'Construct outer and inner nested loops',
      'Calculate total iterations of nested cycles',
      'Traverse 2D coordinate matrices',
    ],
    materialDrops: [{ id: 'm6', materialType: 'logic_bolts', amount: 5 }],
    questions: [
      {
        id: 'lf-q6',
        questId: 'quest-nested-loops',
        question: 'How many total iterations occur in this nested structure?\n\nfor i in range(3):\n    for j in range(4):\n        print(i, j)',
        questionType: 'mcq',
        options: ['12', '7', '9', '6'],
        correctAnswer: '12',
        explanation: 'The outer loop runs 3 times (0, 1, 2). For each outer step, the inner loop runs 4 times (0, 1, 2, 3). Total iterations = 3 × 4 = 12.',
        orderIndex: 1,
        tag: 'Nested Iteration',
      },
      {
        id: 'lf-q7',
        questId: 'quest-nested-loops',
        question: 'Which statement immediately exits the innermost enclosing loop?',
        questionType: 'mcq',
        options: ['break', 'continue', 'pass', 'exit()'],
        correctAnswer: 'break',
        explanation: 'The `break` keyword terminates the smallest enclosing loop immediately, continuing execution at the statement following the loop block.',
        orderIndex: 2,
        tag: 'Control Flow Break',
      },
    ],
  },
  {
    id: 'quest-boss-debugger',
    topicId: 'topic-logic',
    title: 'Dungeon Boss: The Debugger',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    recommendedLevel: 7,
    stage: 4,
    type: 'boss',
    difficulty: 'boss',
    xpReward: 1000,
    goldReward: 400,
    orderIndex: 6,
    isBoss: true,
    description: 'Diagnose and fix critical off-by-one errors and infinite recursion under the boss timer to unlock Function Wastes.',
    storyIntro: 'The ancient guardian of Logic Forest arises! The Debugger casts corrupted code blocks with subtle logical bugs. Spot the flaws before your shield expires.',
    objectives: [
      'Spot off-by-one errors in loop boundaries',
      'Identify infinite while-loop logic traps',
      'Unlock the Function Wastes Gateway',
    ],
    materialDrops: [
      { id: 'm7', materialType: 'pure_crystals', amount: 2 },
      { id: 'm8', materialType: 'logic_bolts', amount: 10 },
    ],
    questions: [
      {
        id: 'lf-q8',
        questId: 'quest-boss-debugger',
        question: 'Identify the bug that causes an infinite loop in this boss attack:\n\nx = 1\nwhile x != 10:\n    x += 2',
        questionType: 'mcq',
        options: [
          'x starts as odd (1, 3, 5, 7, 9, 11...) so it skips 10 and never terminates',
          'The += operator is invalid in Python',
          'x is not initialized inside the while block',
          'Python while loops cannot compare inequality with !=',
        ],
        correctAnswer: 'x starts as odd (1, 3, 5, 7, 9, 11...) so it skips 10 and never terminates',
        explanation: 'Because x increases by 2 starting from 1, it only visits odd numbers (1, 3, 5, 7, 9, 11, 13...). It will never equal 10, creating an infinite loop.',
        orderIndex: 1,
        tag: 'Infinite Loop Bug',
      },
      {
        id: 'lf-q9',
        questId: 'quest-boss-debugger',
        question: 'Which index error occurs if you try to access `items[3]` on `items = ["a", "b", "c"]`?',
        questionType: 'mcq',
        options: ['IndexError', 'KeyError', 'ValueError', 'TypeError'],
        correctAnswer: 'IndexError',
        explanation: 'Python lists are 0-indexed. With 3 items, valid indices are 0, 1, and 2. Index 3 is out of range, raising an IndexError.',
        orderIndex: 2,
        tag: 'Index Error',
      },
    ],
  },
];

// ─── 3. CONTENT HELPER SELECTORS ──────────────────────────────────────────────

export function getAllRegions(): RegionData[] {
  return REGIONS;
}

export function getRegionBySlug(slug: string): RegionData | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function getAllQuests(): GameQuest[] {
  return QUESTS;
}

export function getQuestById(id: string): GameQuest | undefined {
  return QUESTS.find((q) => q.id === id);
}

export function getQuestsByRegion(regionSlug: string): GameQuest[] {
  return QUESTS.filter((q) => q.regionSlug === regionSlug);
}
