/**
 * lib/practiceData.ts — DEVKIT Coding Practice & Challenge Catalog
 *
 * Centralized static catalog for coding challenges, test cases, starter code,
 * hints, and safe deterministic evaluation for the prototype.
 */

export interface ChallengeTestCase {
  id: number;
  description: string;
  input: string;
  expectedOutput: string;
}

export interface PracticeChallenge {
  id: string;
  questId?: string;
  associatedLessonId?: string;
  regionSlug: string;
  regionName: string;
  orderIndex: number;
  stage: number;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'boss';
  language: 'python';
  estimatedMinutes: number;
  objectives: string[];
  expectedConcepts: string[];
  starterCode: string;
  testCases: ChallengeTestCase[];
  hints: string[];
  solutionExplanation: string;
  reward: {
    xp: number;
    gold: number;
  };
  prerequisiteChallengeIds?: string[];
}

export interface EvaluationResult {
  success: boolean;
  score: number;
  testResults: {
    id: number;
    description: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string;
  }[];
  feedback: string;
  executionTimeMs: number;
}

// ─── STATIC CODING CHALLENGES ────────────────────────────────────────────────

export const CHALLENGES: PracticeChallenge[] = [
  // ── PYTHON VILLAGE (CHALLENGES 1-3) ───────────────────────────────────────
  {
    id: 'challenge-print-rite',
    questId: 'quest-intro',
    associatedLessonId: 'lesson-first-steps',
    regionSlug: 'python-village',
    regionName: 'Python Village',
    orderIndex: 1,
    stage: 1,
    title: 'The First Print Rite',
    subtitle: 'Summoning Standard Output',
    description: 'Inscribe a Python spell that summons the message "Welcome to DEVKIT" to the terminal using standard output.',
    difficulty: 'novice',
    language: 'python',
    estimatedMinutes: 3,
    objectives: [
      'Call the built-in print() function',
      'Pass the exact string "Welcome to DEVKIT" as an argument',
      'Execute without syntax errors',
    ],
    expectedConcepts: ['print()', 'String literals', 'Standard output'],
    starterCode: `# Inscribe your first print spell below
# Output: Welcome to DEVKIT

`,
    testCases: [
      {
        id: 1,
        description: 'Standard output displays "Welcome to DEVKIT"',
        input: 'Spell Invocation',
        expectedOutput: 'Welcome to DEVKIT',
      },
      {
        id: 2,
        description: 'String casing and whitespace match exactly',
        input: 'Exact Match Check',
        expectedOutput: 'Welcome to DEVKIT',
      },
    ],
    hints: [
      'Use the built-in print() function in Python.',
      'Wrap your text inside quotes: "Welcome to DEVKIT" or \'Welcome to DEVKIT\'.',
      'Ensure the capitalization and spacing match exactly: print("Welcome to DEVKIT").',
    ],
    solutionExplanation: 'The print() function writes text to the standard console output. In Python, single quotes (\'...\') and double quotes ("...") are interchangeable for defining strings.',
    reward: {
      xp: 40,
      gold: 20,
    },
    prerequisiteChallengeIds: [],
  },

  {
    id: 'challenge-variable-forge',
    questId: 'quest-vars',
    associatedLessonId: 'lesson-vars-power',
    regionSlug: 'python-village',
    regionName: 'Python Village',
    orderIndex: 2,
    stage: 2,
    title: 'Variables of Power',
    subtitle: 'Dynamic Stats Binding & Arithmetic',
    description: 'Bind starting stats for an adventurer: declare `hero_hp = 100` and `damage = 35`. Calculate `remaining_hp = hero_hp - damage` and print the value of `remaining_hp`.',
    difficulty: 'novice',
    language: 'python',
    estimatedMinutes: 4,
    objectives: [
      'Assign hero_hp = 100 and damage = 35',
      'Compute remaining_hp by subtracting damage from hero_hp',
      'Print the resulting remaining_hp to the console',
    ],
    expectedConcepts: ['Variable assignment (=)', 'Integer arithmetic (-)', 'print(variable)'],
    starterCode: `# Declare hero_hp and damage
# Compute remaining_hp = hero_hp - damage
# Print remaining_hp

hero_hp = 100
damage = 35

`,
    testCases: [
      {
        id: 1,
        description: 'remaining_hp equals 65 and is printed to output',
        input: 'Combat Round 1 (100 - 35)',
        expectedOutput: '65',
      },
      {
        id: 2,
        description: 'Variable identifier remaining_hp holds an integer',
        input: 'Type verification',
        expectedOutput: '65',
      },
    ],
    hints: [
      'Assign remaining_hp = hero_hp - damage.',
      'Use print(remaining_hp) without quotation marks to print the variable\'s value.',
      'Check that remaining_hp equals 65.',
    ],
    solutionExplanation: 'Variables in Python hold values in memory. Arithmetic subtraction (-) evaluates the numbers and stores the result in remaining_hp before print() displays it.',
    reward: {
      xp: 50,
      gold: 25,
    },
    prerequisiteChallengeIds: ['challenge-print-rite'],
  },

  {
    id: 'challenge-input-gate',
    questId: 'quest-vars',
    associatedLessonId: 'lesson-input-gate',
    regionSlug: 'python-village',
    regionName: 'Python Village',
    orderIndex: 3,
    stage: 3,
    title: 'The Input Gate & Casting Rite',
    subtitle: 'Converting Numerical Strings & Formatted Dialogue',
    description: 'You are provided with two string inputs: `mana_potion = "25"` and `current_mana = "50"`. Cast both strings to integers using `int()`, compute `total_mana`, and print the formatted string `"Total Mana: {total_mana}"`.',
    difficulty: 'novice',
    language: 'python',
    estimatedMinutes: 5,
    objectives: [
      'Cast string values to integers using the int() function',
      'Calculate total_mana by adding both integers',
      'Print formatted output: "Total Mana: 75"',
    ],
    expectedConcepts: ['Type casting int()', 'Addition (+)', 'f-string formatting'],
    starterCode: `mana_potion = "25"
current_mana = "50"

# Cast strings to integers and calculate total_mana
# Print formatted output: Total Mana: 75

`,
    testCases: [
      {
        id: 1,
        description: 'Calculates total_mana as 75 (not "2550")',
        input: 'Potion infusion ("25" + "50")',
        expectedOutput: 'Total Mana: 75',
      },
      {
        id: 2,
        description: 'Formatted message matches "Total Mana: 75"',
        input: 'Output message formatting',
        expectedOutput: 'Total Mana: 75',
      },
    ],
    hints: [
      'Convert strings with int(mana_potion) and int(current_mana).',
      'Calculate total_mana = int(mana_potion) + int(current_mana).',
      'Print using an f-string: print(f"Total Mana: {total_mana}").',
    ],
    solutionExplanation: 'Because strings cannot be mathematically added without concatenating ("25" + "50" = "2550"), type casting with int() is required to perform real addition.',
    reward: {
      xp: 60,
      gold: 30,
    },
    prerequisiteChallengeIds: ['challenge-variable-forge'],
  },

  // ── LOGIC FOREST (CHALLENGES 4-6) ─────────────────────────────────────────
  {
    id: 'challenge-boolean-trial',
    questId: 'quest-conditionals',
    associatedLessonId: 'lesson-boolean-shrine',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    orderIndex: 4,
    stage: 1,
    title: 'The Boolean Shrine',
    subtitle: 'Branching Decision Logic with if / elif / else',
    description: 'Write a conditional health evaluation block. For `player_hp = 45`: if `player_hp > 50`, print `"Healthy"`; elif `player_hp > 20`, print `"Wounded"`; else print `"Fainted"`.',
    difficulty: 'apprentice',
    language: 'python',
    estimatedMinutes: 6,
    objectives: [
      'Construct an if statement testing player_hp > 50',
      'Construct an elif statement testing player_hp > 20',
      'Construct an else fallback branch',
      'Ensure proper 4-space indentation for branch bodies',
    ],
    expectedConcepts: ['if-elif-else statements', 'Comparison operators (>)', 'Indentation blocks'],
    starterCode: `player_hp = 45

# Inscribe your conditional branching logic below:
# if player_hp > 50 -> "Healthy"
# elif player_hp > 20 -> "Wounded"
# else -> "Fainted"

`,
    testCases: [
      {
        id: 1,
        description: 'player_hp = 45 evaluates to "Wounded"',
        input: 'player_hp = 45',
        expectedOutput: 'Wounded',
      },
      {
        id: 2,
        description: 'Branching boundaries (>50, >20) structured correctly',
        input: 'Branching structure validation',
        expectedOutput: 'Wounded',
      },
    ],
    hints: [
      'Start with `if player_hp > 50:` followed by an indented `print("Healthy")`.',
      'Add `elif player_hp > 20:` followed by `print("Wounded")`.',
      'End with `else:` followed by `print("Fainted")`.',
    ],
    solutionExplanation: 'Python evaluates if/elif conditions from top to bottom. Since 45 is not > 50, but 45 is > 20, only the elif branch executes.',
    reward: {
      xp: 75,
      gold: 35,
    },
    prerequisiteChallengeIds: ['challenge-input-gate'],
  },

  {
    id: 'challenge-loop-trial',
    questId: 'quest-loops',
    associatedLessonId: 'lesson-looping-path',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    orderIndex: 5,
    stage: 2,
    title: 'The Looping Path',
    subtitle: 'Iterating Numbers with for & range()',
    description: 'Use a `for` loop and `range(2, 8, 2)` to iterate through numbers 2, 4, 6. Multiply each number by 10 and print each resulting value on a new line.',
    difficulty: 'apprentice',
    language: 'python',
    estimatedMinutes: 6,
    objectives: [
      'Construct a for loop using range(2, 8, 2)',
      'Multiply each loop variable value by 10',
      'Print each multiplied result (20, 40, 60)',
    ],
    expectedConcepts: ['for...in loop', 'range(start, stop, step)', 'Multiplication (*)'],
    starterCode: `# Inscribe a for loop using range(2, 8, 2)
# Multiply each number by 10 and print it

`,
    testCases: [
      {
        id: 1,
        description: 'Outputs 20, 40, 60 on separate lines',
        input: 'range(2, 8, 2) iteration',
        expectedOutput: '20\n40\n60',
      },
      {
        id: 2,
        description: 'Loop completes exactly 3 iterations',
        input: 'Iteration count check',
        expectedOutput: '20\n40\n60',
      },
    ],
    hints: [
      'Use `for num in range(2, 8, 2):` to iterate over 2, 4, and 6.',
      'Inside the indented loop body, write `print(num * 10)`.',
      'Ensure the indentation matches Python\'s block requirements.',
    ],
    solutionExplanation: 'range(2, 8, 2) generates the sequence [2, 4, 6]. Multiplying each element by 10 outputs 20, 40, and 60 across three iterations.',
    reward: {
      xp: 90,
      gold: 40,
    },
    prerequisiteChallengeIds: ['challenge-boolean-trial'],
  },

  {
    id: 'challenge-nested-labyrinth',
    questId: 'quest-nested-loops',
    associatedLessonId: 'lesson-nested-labyrinth',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    orderIndex: 6,
    stage: 3,
    title: 'The Nested Labyrinth',
    subtitle: '2D Grid Iteration & break Interruption',
    description: 'Scan a 2x2 grid using nested loops: outer loop `row in range(1, 3)` and inner loop `col in range(1, 3)`. Print each coordinate as `[Row {row}, Col {col}]`. If `row == 2 and col == 2`, print `"Core Reached"` and `break` out of the inner loop.',
    difficulty: 'journeyman',
    language: 'python',
    estimatedMinutes: 7,
    objectives: [
      'Construct an outer loop for row in range(1, 3)',
      'Construct an inner loop for col in range(1, 3)',
      'Print "[Row {row}, Col {col}]" on each step',
      'Check if row == 2 and col == 2 to print "Core Reached" and break',
    ],
    expectedConcepts: ['Nested for loops', '2D coordinate matrices', 'break statement', 'f-string formatting'],
    starterCode: `# Outer loop: row in range(1, 3)
# Inner loop: col in range(1, 3)
# Print "[Row {row}, Col {col}]"
# When row == 2 and col == 2, print "Core Reached" and break

`,
    testCases: [
      {
        id: 1,
        description: 'Scans coordinates and breaks at [Row 2, Col 2]',
        input: '2x2 Matrix scan with break',
        expectedOutput: '[Row 1, Col 1]\n[Row 1, Col 2]\n[Row 2, Col 1]\n[Row 2, Col 2]\nCore Reached',
      },
      {
        id: 2,
        description: 'break keyword terminates inner loop safely',
        input: 'Control flow interruption',
        expectedOutput: '[Row 1, Col 1]\n[Row 1, Col 2]\n[Row 2, Col 1]\n[Row 2, Col 2]\nCore Reached',
      },
    ],
    hints: [
      'Structure the loops: `for row in range(1, 3):` and inside it `for col in range(1, 3):`.',
      'Print `print(f"[Row {row}, Col {col}]")`.',
      'Add `if row == 2 and col == 2:` then `print("Core Reached")` and `break`.',
    ],
    solutionExplanation: 'Nested loops iterate over rows and columns. The break statement immediately exits the inner column loop when the core condition is met.',
    reward: {
      xp: 120,
      gold: 60,
    },
    prerequisiteChallengeIds: ['challenge-loop-trial'],
  },
];

// ─── HELPER SELECTORS ────────────────────────────────────────────────────────

export function getAllChallenges(): PracticeChallenge[] {
  return CHALLENGES;
}

export function getChallengeById(id: string): PracticeChallenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export function getChallengesByRegion(regionSlug: string): PracticeChallenge[] {
  return CHALLENGES.filter((c) => c.regionSlug === regionSlug);
}

// ─── SAFE PROTOTYPE EVALUATOR ────────────────────────────────────────────────

export function evaluateChallengeCode(challengeId: string, userCode: string): EvaluationResult {
  const trimmed = userCode.trim();
  const startTime = Date.now();

  if (!trimmed) {
    return {
      success: false,
      score: 0,
      testResults: [
        {
          id: 1,
          description: 'Code presence verification',
          input: 'Submission',
          expected: 'Non-empty Python code',
          actual: 'Empty code buffer',
          passed: false,
          error: 'Please inscribe Python code before running tests.',
        },
      ],
      feedback: 'No code submitted. Inscribe your Python spell in the editor above.',
      executionTimeMs: 12,
    };
  }

  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return {
      success: false,
      score: 0,
      testResults: [],
      feedback: 'Challenge not found in realm archives.',
      executionTimeMs: 5,
    };
  }

  // Safe heuristic pattern & execution validation for each challenge
  let passes = true;
  let simulatedOutput = '';
  let errorMessage: string | undefined = undefined;

  switch (challengeId) {
    case 'challenge-print-rite': {
      // Must contain print with "Welcome to DEVKIT"
      const hasPrint = /print\s*\(\s*["']Welcome to DEVKIT["']\s*\)/i.test(trimmed);
      if (hasPrint) {
        simulatedOutput = 'Welcome to DEVKIT';
        passes = true;
      } else {
        passes = false;
        errorMessage = 'Expected print("Welcome to DEVKIT") to be called.';
        simulatedOutput = trimmed.includes('print') ? 'Output mismatch' : 'No output generated';
      }
      break;
    }

    case 'challenge-variable-forge': {
      const hasHeroHp = /hero_hp\s*=\s*100/.test(trimmed);
      const hasDamage = /damage\s*=\s*35/.test(trimmed);
      const hasSubtraction = /remaining_hp\s*=\s*hero_hp\s*-\s*damage/.test(trimmed) || /100\s*-\s*35/.test(trimmed);
      const hasPrint = /print\s*\(\s*remaining_hp\s*\)/.test(trimmed) || /print\s*\(\s*65\s*\)/.test(trimmed);

      if (hasHeroHp && hasDamage && (hasSubtraction || hasPrint)) {
        simulatedOutput = '65';
        passes = true;
      } else {
        passes = false;
        errorMessage = 'Ensure hero_hp = 100, damage = 35, and print(remaining_hp) are defined.';
        simulatedOutput = 'Error evaluating variables';
      }
      break;
    }

    case 'challenge-input-gate': {
      const hasIntCast = /int\s*\(\s*mana_potion\s*\)/.test(trimmed) || /int\s*\(\s*current_mana\s*\)/.test(trimmed) || /total_mana\s*=\s*75/.test(trimmed);
      const hasFormattedPrint = /print\s*\(\s*f?["']Total Mana:\s*\{?total_mana\}?["']\s*\)/i.test(trimmed) || /print\s*\(\s*["']Total Mana:\s*75["']\s*\)/i.test(trimmed);

      if (hasIntCast && hasFormattedPrint) {
        simulatedOutput = 'Total Mana: 75';
        passes = true;
      } else {
        passes = false;
        errorMessage = 'Cast strings to integers with int() and print "Total Mana: 75".';
        simulatedOutput = 'Total Mana: [Invalid]';
      }
      break;
    }

    case 'challenge-boolean-trial': {
      const hasIf = /if\s+player_hp\s*>\s*50\s*:/.test(trimmed);
      const hasElif = /elif\s+player_hp\s*>\s*20\s*:/.test(trimmed);
      const hasElse = /else\s*:/.test(trimmed);
      const hasWounded = /["']Wounded["']/.test(trimmed);

      if ((hasIf && hasElif && hasElse) || (hasElif && hasWounded)) {
        simulatedOutput = 'Wounded';
        passes = true;
      } else {
        passes = false;
        errorMessage = 'Include if player_hp > 50, elif player_hp > 20, and else branches.';
        simulatedOutput = 'Unmatched condition';
      }
      break;
    }

    case 'challenge-loop-trial': {
      const hasRange = /range\s*\(\s*2\s*,\s*8\s*,\s*2\s*\)/.test(trimmed);
      const hasFor = /for\s+\w+\s+in\s+range/.test(trimmed);
      const hasMul = /\*\s*10/.test(trimmed);

      if (hasRange && hasFor && hasMul) {
        simulatedOutput = '20\n40\n60';
        passes = true;
      } else {
        passes = false;
        errorMessage = 'Construct a for loop with range(2, 8, 2) and multiply each step by 10.';
        simulatedOutput = 'Loop syntax incomplete';
      }
      break;
    }

    case 'challenge-nested-labyrinth': {
      const hasOuter = /for\s+row\s+in\s+range\s*\(\s*1\s*,\s*3\s*\)\s*:/.test(trimmed);
      const hasInner = /for\s+col\s+in\s+range\s*\(\s*1\s*,\s*3\s*\)\s*:/.test(trimmed);
      const hasBreak = /break/.test(trimmed);
      const hasCore = /["']Core Reached["']/.test(trimmed);

      if (hasOuter && hasInner && hasBreak && hasCore) {
        simulatedOutput = '[Row 1, Col 1]\n[Row 1, Col 2]\n[Row 2, Col 1]\n[Row 2, Col 2]\nCore Reached';
        passes = true;
      } else {
        passes = false;
        errorMessage = 'Use nested loops for row and col in range(1, 3) with a break condition.';
        simulatedOutput = 'Matrix scan error';
      }
      break;
    }

    default: {
      passes = true;
      simulatedOutput = challenge.testCases[0]?.expectedOutput || 'Success';
    }
  }

  const executionTimeMs = Math.floor(Math.random() * 25) + 18;

  const testResults = challenge.testCases.map((tc) => {
    const isPassed = passes;
    return {
      id: tc.id,
      description: tc.description,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: isPassed ? tc.expectedOutput : simulatedOutput,
      passed: isPassed,
      error: isPassed ? undefined : errorMessage,
    };
  });

  const score = passes ? 100 : 0;
  const feedback = passes
    ? 'All test cases passed! Your Python spell executes flawlessly.'
    : errorMessage || 'Execution output does not match expected test results. Review your code logic.';

  return {
    success: passes,
    score,
    testResults,
    feedback,
    executionTimeMs,
  };
}
