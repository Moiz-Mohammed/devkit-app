/**
 * lib/learningData.ts — DEVKIT Python Realm Static Learning Content
 *
 * Centralized static catalog for lessons, tomes, code demonstrations,
 * and checkpoint questions. Fully decoupled from player progression state.
 */

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  output?: string;
  explanation?: string;
  tip?: string;
}

export interface LessonCheckpoint {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface LessonReward {
  xp: number;
  gold: number;
  knowledgeGained: string[];
}

export interface GameLesson {
  id: string;
  regionSlug: string;
  regionName: string;
  orderIndex: number;
  stage: number;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'boss';
  estimatedMinutes: number;
  objectives: string[];
  sections: LessonSection[];
  checkpoint: LessonCheckpoint;
  reward: LessonReward;
  associatedQuestId?: string;
}

// ─── STATIC LESSONS CATALOG ──────────────────────────────────────────────────

export const LESSONS: GameLesson[] = [
  // ── PYTHON VILLAGE (LESSONS 1-3) ──────────────────────────────────────────
  {
    id: 'lesson-first-steps',
    regionSlug: 'python-village',
    regionName: 'Python Village',
    orderIndex: 1,
    stage: 1,
    title: 'The First Steps of Python',
    subtitle: 'Syntax Basics, Output Shrines & The Sacred Indentation',
    description: 'Enter the Python sanctuary. Discover why Python is favored by arcane developers, understand the syntax rules, and learn to cast your very first print statement.',
    difficulty: 'novice',
    estimatedMinutes: 4,
    associatedQuestId: 'quest-intro',
    objectives: [
      'Understand the nature and philosophy of Python',
      'Learn how Python executes statements sequentially from top to bottom',
      'Summon terminal output using the built-in print() function',
      'Inscribe non-executable developer comments using the # symbol',
    ],
    sections: [
      {
        id: 'sec-intro',
        title: '1. The Way of the Pythonist',
        content: `Welcome to the realm of Python, novice! Unlike older, more verbose languages that demand heavy ceremonial syntax (semicolons, public static void mains, and curly-bracket fortresses), Python prioritizes readability, elegance, and human expression.\n\nIn Python, clean structure is enforced by **indentation** (whitespace) rather than curly braces. Code reads like structured prose, allowing developers to turn algorithmic thoughts directly into working spells.`,
        tip: 'In Python, simplicity beats complexity. Write code that is easy for humans to read, not just machines to execute.',
      },
      {
        id: 'sec-print',
        title: '2. Summoning Output with print()',
        content: `The most fundamental incantation in all of programming is outputting words to the realm's terminal. In Python, this is accomplished with the built-in \`print()\` function.\n\nAnything wrapped in quotes (single \`'...\`' or double \`"..."\`) is treated as a **string** of text.`,
        codeExample: `# The foundational rite of every developer
print("Welcome to the Realm of DEVKIT!")
print('The sanctuary doors open before you.')`,
        output: `Welcome to the Realm of DEVKIT!
The sanctuary doors open before you.`,
        explanation: `The print() function takes arguments inside parentheses and writes them to the standard output terminal. Each print statement automatically appends a newline character, so consecutive print calls appear on separate lines.`,
      },
      {
        id: 'sec-comments',
        title: '3. Inscribing Developer Comments',
        content: `As your spells grow in complexity, you will need to leave notes for yourself and fellow adventurers. These are known as **comments**.\n\nAny text following the hash character (\`#\`) is completely ignored by the Python interpreter during execution.`,
        codeExample: `# This line is a comment: The interpreter ignores it
print("Code runs here!") # Inline comments can follow valid code

# Multi-line explanations can simply use
# multiple comment markers in succession.
print("Power level rising.")`,
        output: `Code runs here!
Power level rising.`,
        explanation: `Comments serve as documentation and blueprints. Use them to clarify the intent behind complex logic, explain tricky edge-cases, or temporarily disable code blocks while experimenting.`,
      },
    ],
    checkpoint: {
      question: 'Which of the following statements correctly outputs the message "Adventurer Ready" to the terminal in Python?',
      options: [
        'print("Adventurer Ready")',
        'echo("Adventurer Ready")',
        'console.log("Adventurer Ready")',
        'System.out.println("Adventurer Ready")',
      ],
      correctAnswer: 'print("Adventurer Ready")',
      explanation: 'In Python, the built-in print() function is the universal way to display output in the terminal. No semicolons or boilerplate classes are required.',
      hint: 'Look for Python’s universal built-in function that takes parentheses.',
    },
    reward: {
      xp: 25,
      gold: 10,
      knowledgeGained: ['Python Syntax Philosophy', 'print() Function', 'Hash Comments (#)'],
    },
  },

  {
    id: 'lesson-vars-power',
    regionSlug: 'python-village',
    regionName: 'Python Village',
    orderIndex: 2,
    stage: 2,
    title: 'Variables of Power',
    subtitle: 'Dynamic Memory Binding & Fundamental Data Types',
    description: 'Learn how to store, rename, and manipulate dynamic stats (Health, Mana, Player Names) in memory identifiers using Python’s dynamic typing system.',
    difficulty: 'novice',
    estimatedMinutes: 5,
    associatedQuestId: 'quest-vars',
    objectives: [
      'Bind values to variable names with the assignment operator (=)',
      'Differentiate primitive types: integers, floats, strings, and booleans',
      'Understand dynamic typing and re-assignment in Python',
      'Adopt the snake_case variable naming convention',
    ],
    sections: [
      {
        id: 'sec-assignment',
        title: '1. Binding Memory Identifiers',
        content: `A variable is a labeled container in memory. In Python, you do not declare a variable before using it; you create one the moment you assign a value to it using the single equals sign (\`=\`).\n\nUnlike static languages where you must declare \`int hp = 100;\`, Python automatically infers the type of the value at runtime.`,
        codeExample: `player_name = "Moiz"
player_level = 7
player_health = 98.5
is_alive = True

print(player_name)
print(player_level)`,
        output: `Moiz
7`,
        explanation: `Here, player_name holds a string, player_level holds an integer, player_health holds a floating-point number, and is_alive holds a boolean.`,
      },
      {
        id: 'sec-types',
        title: '2. The Four Fundamental Data Types',
        content: `Python provides four basic primitive types that form the building blocks of all logic:\n\n1. **Integer (\`int\`)**: Whole numbers without decimals (\`10\`, \`-5\`, \`0\`).\n2. **Float (\`float\`)**: Numbers with decimal points (\`3.14\`, \`0.05\`, \`-12.8\`).\n3. **String (\`str\`)**: Sequences of unicode text enclosed in matching quotes (\`"Blade"\`, \`'Python'\`).\n4. **Boolean (\`bool\`)**: Absolute truth values — only \`True\` or \`False\` (note the uppercase first letters).`,
        codeExample: `gold_coins = 420          # int
crit_rate = 0.25          # float
weapon_name = "Void Wand" # str
in_combat = False         # bool

print(type(gold_coins))
print(type(weapon_name))`,
        output: `<class 'int'>
<class 'str'>`,
        explanation: `You can query the data type of any variable using Python's built-in type() function.`,
      },
      {
        id: 'sec-naming',
        title: '3. Reassignment & PEP8 Naming',
        content: `Variables can change their values at any time during execution. Furthermore, according to Python's official style guide (PEP8), multi-word variable names must be written in **snake_case** (lowercase letters joined by underscores).`,
        codeExample: `current_mana = 50
print("Initial mana:", current_mana)

# Mana potion consumed!
current_mana = current_mana + 25
print("Restored mana:", current_mana)`,
        output: `Initial mana: 50
Restored mana: 75`,
        explanation: `Python computes the right-hand side of the '=' operator first (50 + 25 = 75), then assigns the resulting value back to the variable identifier on the left.`,
      },
    ],
    checkpoint: {
      question: 'Which of the following is the standard, valid Python statement to create a variable storing mana points?',
      options: [
        'hero_mana = 100',
        'int hero_mana = 100;',
        'let hero_mana = 100',
        '$hero_mana = 100',
      ],
      correctAnswer: 'hero_mana = 100',
      explanation: 'Python uses clean dynamic assignment without keywords like int or let, requires no leading $ signs, and does not require semicolons.',
      hint: 'In Python, simply write the variable name, =, and the value.',
    },
    reward: {
      xp: 30,
      gold: 15,
      knowledgeGained: ['Variable Assignment (=)', 'Primitive Types (int, float, str, bool)', 'PEP8 snake_case Rules'],
    },
  },

  {
    id: 'lesson-input-gate',
    regionSlug: 'python-village',
    regionName: 'Python Village',
    orderIndex: 3,
    stage: 3,
    title: 'The Input Gate',
    subtitle: 'Interactive Terminal Dialogue & Type Casting Rites',
    description: 'Learn how to accept user interaction from the console using input(), convert strings into numbers using type casting, and format dynamic adventurer dialogue.',
    difficulty: 'novice',
    estimatedMinutes: 5,
    associatedQuestId: 'quest-vars',
    objectives: [
      'Capture terminal user keyboard input with the input() function',
      'Understand that input() always produces a string (str) return value',
      'Perform type casting using int() and float() to enable arithmetic',
      'Combine variables and text using modern Python f-strings',
    ],
    sections: [
      {
        id: 'sec-input-fn',
        title: '1. Conversing with the Player: input()',
        content: `Programs become truly interactive when they listen to the user. The built-in \`input()\` function pauses execution and waits for the player to type a response in the console and press Enter.\n\n**Crucial Rule:** \`input()\` *always* returns whatever the user typed as a **String (\`str\`)**, even if they typed numbers!`,
        codeExample: `# Prompting the player for their character name
# (In a real terminal, it pauses for input)
hero_name = "Moiz" # Simulating user typed 'Moiz'
print("Welcome to the realm,", hero_name)`,
        output: `Welcome to the realm, Moiz`,
        explanation: `When input("Prompt message: ") runs in a terminal, it displays the prompt and returns the typed text as a string to your variable.`,
      },
      {
        id: 'sec-casting',
        title: '2. Type Casting Rites: int() and float()',
        content: `If you ask the player for their gold or age, \`input()\` returns a string like \`"10"\`. If you try to do math like \`"10" + 5\`, Python raises a \`TypeError\` because you cannot add a number to text!\n\nTo solve this, use **type casting** functions: \`int()\` converts text into whole numbers, and \`float()\` converts text into decimals.`,
        codeExample: `coins_input = "25" # String from input()
coins_number = int(coins_input) # Cast to integer

total_coins = coins_number + 15
print("Total Purse:", total_coins)`,
        output: `Total Purse: 40`,
        explanation: `int("25") transforms the text "25" into the real integer 25, allowing mathematical addition.`,
      },
      {
        id: 'sec-fstrings',
        title: '3. Formatted Strings (f-strings)',
        content: `Python 3.6 introduced the most elegant way to embed variables inside strings: **f-strings** (Formatted String Literals). Prefix your string with an \`f\` and wrap any variable or expression inside curly brackets \`{...}\`.`,
        codeExample: `adventurer = "Moiz"
level = 7
guild = "Code Guild"

# Beautiful f-string syntax
summary = f"Adventurer {adventurer} (Lvl {level}) belongs to {guild}."
print(summary)`,
        output: `Adventurer Moiz (Lvl 7) belongs to Code Guild.`,
        explanation: `Python evaluates the expressions inside the curly braces at runtime and seamlessly converts them into text.`,
      },
    ],
    checkpoint: {
      question: 'What is the return data type of the built-in input() function in Python?',
      options: [
        'Always a string (str)',
        'Always an integer (int)',
        'Automatically inferred as int or float',
        'None',
      ],
      correctAnswer: 'Always a string (str)',
      explanation: 'The input() function always captures keyboard input as a string (str). If numerical math is required, you must explicitly cast it using int() or float().',
      hint: 'Remember: even if you type 42, Python reads it as text unless you convert it.',
    },
    reward: {
      xp: 35,
      gold: 20,
      knowledgeGained: ['input() Dialogue', 'Type Casting (int, float)', 'Formatted f-strings'],
    },
  },

  // ── LOGIC FOREST (LESSONS 4-6) ────────────────────────────────────────────
  {
    id: 'lesson-boolean-shrine',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    orderIndex: 4,
    stage: 1,
    title: 'The Boolean Shrine',
    subtitle: 'Branching Conditions, Comparison Operators & Truth Tables',
    description: 'Venture beneath the canopy of Logic Forest. Master the Boolean rites of if, elif, and else branching to guide your execution flow through twisting forest pathways.',
    difficulty: 'apprentice',
    estimatedMinutes: 6,
    associatedQuestId: 'quest-conditionals',
    objectives: [
      'Form conditional expressions using if, elif, and else statements',
      'Use comparison operators: ==, !=, <, >, <=, >=',
      'Combine boolean logic using and, or, and not keywords',
      'Understand how Python indentation blocks dictate branch scope',
    ],
    sections: [
      {
        id: 'sec-if-else',
        title: '1. The Fork in the Path: if and else',
        content: `In the Logic Forest, a single straight line of code is not enough. Programs must make decisions. An \`if\` statement evaluates a boolean condition: if the condition is \`True\`, the indented code block runs. If \`False\`, execution skips that block or falls back to an \`else\` block.`,
        codeExample: `player_hp = 45

if player_hp > 0:
    print("The hero stands strong!")
else:
    print("The hero has fallen in battle.")`,
        output: `The hero stands strong!`,
        explanation: `Because player_hp (45) is greater than 0, the first condition evaluates to True and the if-block executes. The else block is completely skipped.`,
      },
      {
        id: 'sec-elif',
        title: '2. Multi-Path Branching with elif',
        content: `When you need to test multiple distinct conditions in sequence, use \`elif\` (short for "else if"). Python checks conditions in order from top to bottom. The moment *one* condition is met, its block executes and all subsequent \`elif\` and \`else\` blocks are skipped.`,
        codeExample: `boss_hp = 25

if boss_hp > 80:
    print("Boss Status: Enraged and Full Power")
elif boss_hp > 30:
    print("Boss Status: Wounded")
elif boss_hp > 0:
    print("Boss Status: Critical Health! Strike now!")
else:
    print("Boss Status: Defeated")`,
        output: `Boss Status: Critical Health! Strike now!`,
        explanation: `Python tests >80 (False), then >30 (False), then >0 (True). It executes the critical health statement and skips the remaining else.`,
      },
      {
        id: 'sec-logical-ops',
        title: '3. Combining Truth: and, or, not',
        content: `You can construct compound logic gates using Python's plain English logical operators:\n\n- \`and\`: Evaluates to \`True\` only if **both** sides are True.\n- \`or\`: Evaluates to \`True\` if **at least one** side is True.\n- \`not\`: Inverts the truth value (\`not True\` is \`False\`).`,
        codeExample: `has_key = True
door_locked = False
player_level = 5

# Compound condition
if has_key and not door_locked:
    print("The ancient vault unlocks seamlessly!")
elif player_level >= 10:
    print("Forced entry through brute power.")`,
        output: `The ancient vault unlocks seamlessly!`,
        explanation: `has_key is True and not door_locked is True (not False = True). True and True produces True.`,
      },
    ],
    checkpoint: {
      question: 'What is the output of the following Python code?\n\nx = 15\nif x > 20:\n    print("High")\nelif x > 10:\n    print("Medium")\nelse:\n    print("Low")',
      options: ['Medium', 'High', 'Low', 'High and Medium'],
      correctAnswer: 'Medium',
      explanation: 'The condition x > 20 evaluates to False because 15 is not greater than 20. The next condition x > 10 evaluates to True (15 > 10), so "Medium" is printed and the else block is bypassed.',
      hint: 'Evaluate the conditions step-by-step from top to bottom.',
    },
    reward: {
      xp: 40,
      gold: 25,
      knowledgeGained: ['Conditional Branching (if, elif, else)', 'Comparison Operators (==, !=, <, >)', 'Logical Operators (and, or, not)'],
    },
  },

  {
    id: 'lesson-looping-path',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    orderIndex: 5,
    stage: 2,
    title: 'The Looping Path',
    subtitle: 'Iterative Cycles with for, while & The range() Generator',
    description: 'Master the iterative cycles of repetition. Learn when to unleash for-in loops over collections and how to safely control while loops without falling into infinite loop traps.',
    difficulty: 'apprentice',
    estimatedMinutes: 6,
    associatedQuestId: 'quest-loops',
    objectives: [
      'Traverse elements in sequences using the for...in loop',
      'Generate numerical sequences using range(start, stop, step)',
      'Construct conditional while loops with proper termination predicates',
      'Understand the difference between definite and indefinite iteration',
    ],
    sections: [
      {
        id: 'sec-for-loop',
        title: '1. The for-in Loop & range()',
        content: `A \`for\` loop in Python is designed for **definite iteration** — executing a block of code once for each element in a sequence.\n\nThe built-in \`range()\` function generates a stream of numbers:\n- \`range(5)\` produces \`0, 1, 2, 3, 4\` (starts at 0, stops before 5).\n- \`range(2, 6)\` produces \`2, 3, 4, 5\`.\n- \`range(1, 10, 2)\` steps by 2, producing \`1, 3, 5, 7, 9\`.`,
        codeExample: `# Casting multiple fire arrows
for wave in range(1, 4):
    print(f"Casting spell wave {wave}!")`,
        output: `Casting spell wave 1!
Casting spell wave 2!
Casting spell wave 3!`,
        explanation: `range(1, 4) iterates through numbers 1, 2, and 3. On each iteration, the variable wave receives the current number.`,
      },
      {
        id: 'sec-iter-collections',
        title: '2. Direct Collection Iteration',
        content: `In Python, you do not need manual index counters (\`i = 0; i < len(arr); i++\`) to traverse lists. You directly iterate over the items using \`for item in collection:\`.`,
        codeExample: `party_members = ["Moiz", "Aria", "Thorin"]

for hero in party_members:
    print(f"Hero {hero} is ready for combat.")`,
        output: `Hero Moiz is ready for combat.
Hero Aria is ready for combat.
Hero Thorin is ready for combat.`,
        explanation: `Python assigns each string in the list to the variable hero in sequential order.`,
      },
      {
        id: 'sec-while-loop',
        title: '3. The while Loop & Preventing Infinite Traps',
        content: `A \`while\` loop repeatedly executes as long as a boolean condition remains \`True\`. It is ideal when you do not know beforehand how many iterations are needed.\n\n**Warning:** You must always ensure the condition eventually becomes \`False\`, otherwise your program will be trapped in an **infinite loop**!`,
        codeExample: `shield_durability = 3

while shield_durability > 0:
    print(f"Shield holding! Durability: {shield_durability}")
    shield_durability -= 1 # Decrement durability

print("Shield shattered!")`,
        output: `Shield holding! Durability: 3
Shield holding! Durability: 2
Shield holding! Durability: 1
Shield shattered!`,
        explanation: `With each cycle, shield_durability decreases by 1. When it reaches 0, 0 > 0 evaluates to False, terminating the loop safely.`,
      },
    ],
    checkpoint: {
      question: 'What numbers are generated by `range(2, 10, 3)`?',
      options: ['2, 5, 8', '2, 5, 8, 10', '2, 3, 4, 5, 6, 7, 8, 9', '3, 6, 9'],
      correctAnswer: '2, 5, 8',
      explanation: 'range(start, stop, step) starts at 2, adds the step 3 to get 5, adds 3 again to get 8, and stops because the next step (11) is >= the stop boundary (10).',
      hint: 'Start at 2, increment by 3, and stop strictly before 10.',
    },
    reward: {
      xp: 45,
      gold: 30,
      knowledgeGained: ['for...in Loops', 'range(start, stop, step)', 'while Loops & Termination Predicates'],
    },
  },

  {
    id: 'lesson-nested-labyrinth',
    regionSlug: 'logic-forest',
    regionName: 'Logic Forest',
    orderIndex: 6,
    stage: 3,
    title: 'The Nested Labyrinth',
    subtitle: 'Multi-Dimensional Iteration, Matrix Traversal & break / continue',
    description: 'Delve into the deepest maze of Logic Forest. Master nested loop matrices, calculate cumulative iteration counts, and wield break and continue to control execution flow.',
    difficulty: 'journeyman',
    estimatedMinutes: 7,
    associatedQuestId: 'quest-nested-loops',
    objectives: [
      'Construct nested loops with an outer loop and inner loop',
      'Calculate total iterations of multi-layered loops (Outer × Inner)',
      'Interrupt and alter loop flow with break and continue statements',
      'Diagnose and prevent off-by-one errors and loop performance pitfalls',
    ],
    sections: [
      {
        id: 'sec-nested-loops',
        title: '1. Outer and Inner Loop Architecture',
        content: `A **nested loop** is a loop situated inside the body of another loop. For *every single iteration* of the outer loop, the inner loop completes its entire cycle from start to finish.\n\nThis pattern is essential for processing 2D coordinate maps, grids, image pixels, and database tables.`,
        codeExample: `# Scanning a 2x3 dungeon chamber grid
for row in range(1, 3):       # Outer loop: 2 rows (1, 2)
    for col in range(1, 4):   # Inner loop: 3 cols (1, 2, 3)
        print(f"Scanning Chamber [Row {row}, Col {col}]")`,
        output: `Scanning Chamber [Row 1, Col 1]
Scanning Chamber [Row 1, Col 2]
Scanning Chamber [Row 1, Col 3]
Scanning Chamber [Row 2, Col 1]
Scanning Chamber [Row 2, Col 2]
Scanning Chamber [Row 2, Col 3]`,
        explanation: `Total iterations = Outer (2) × Inner (3) = 6 iterations. The inner loop finishes all 3 columns before the outer loop advances to row 2.`,
      },
      {
        id: 'sec-break-continue',
        title: '2. Wielding break and continue',
        content: `You can wield special keywords to change the natural rhythm of any loop:\n\n- \`break\`: Instantly shatters and terminates the smallest enclosing loop immediately.\n- \`continue\`: Skips the rest of the current iteration and jumps directly to the next cycle.`,
        codeExample: `print("--- Using continue (Skip odd numbers) ---")
for num in range(1, 6):
    if num % 2 != 0:
        continue # Skip to next iteration
    print(f"Even number processed: {num}")

print("\n--- Using break (Stop on danger) ---")
for danger_level in range(1, 10):
    if danger_level == 3:
        print("Trap triggered! Breaking loop!")
        break
    print(f"Danger step {danger_level} cleared")`,
        output: `--- Using continue (Skip odd numbers) ---
Even number processed: 2
Even number processed: 4

--- Using break (Stop on danger) ---
Danger step 1 cleared
Danger step 2 cleared
Trap triggered! Breaking loop!`,
        explanation: `continue jumps over the print statement for odd numbers. break halts the loop completely the moment danger_level equals 3.`,
      },
      {
        id: 'sec-traps',
        title: '3. Common Pitfalls: Off-by-One & Nesting Depth',
        content: `Two critical rules for master developers:\n\n1. **Off-by-One Errors**: Remember that \`range(0, 5)\` iterates 5 times, but its highest number is \`4\` (0 to 4). If you need 5 included, write \`range(0, 6)\`.\n2. **Nesting Depth**: Deeply nested loops (O(N^3) or O(N^4)) can dramatically slow down execution. Keep nesting clean, modular, and minimal.`,
        codeExample: `# Careful boundary verification
target_steps = 5
for step in range(1, target_steps + 1):
    print(f"Step {step} of {target_steps} verified.")`,
        output: `Step 1 of 5 verified.
Step 2 of 5 verified.
Step 3 of 5 verified.
Step 4 of 5 verified.
Step 5 of 5 verified.`,
        explanation: `Using range(1, target_steps + 1) ensures the loop correctly runs from 1 through 5 inclusive.`,
      },
    ],
    checkpoint: {
      question: 'Which statement immediately exits and terminates the innermost loop enclosing it?',
      options: ['break', 'continue', 'pass', 'return()'],
      correctAnswer: 'break',
      explanation: 'The break keyword immediately breaks out of the innermost enclosing loop, continuing execution at the first line of code following the loop block.',
      hint: 'Choose the command that completely stops the loop, unlike continue which only skips one turn.',
    },
    reward: {
      xp: 50,
      gold: 35,
      knowledgeGained: ['Nested Loop Multi-Iteration', 'Matrix Traversal Patterns', 'break vs continue Flow Control'],
    },
  },
];

// ─── HELPER SELECTORS ────────────────────────────────────────────────────────

export function getAllLessons(): GameLesson[] {
  return LESSONS;
}

export function getLessonById(id: string): GameLesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLessonsByRegion(regionSlug: string): GameLesson[] {
  return LESSONS.filter((l) => l.regionSlug === regionSlug);
}
