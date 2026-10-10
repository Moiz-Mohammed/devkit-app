# ⚔️ DEVKIT — Gamified CSE Learning Realm

> **"Learn like you're playing. Master like you mean it."**  
> A dark fantasy RPG developer platform that transforms Computer Science education into an epic journey of conquest, knowledge acquisition, combat trials, and executable code mastery.

---

## 🌟 Overview

**DEVKIT** is a full-stack, gamified Computer Science learning platform combining high-stakes RPG progression mechanics with professional developer tooling. Students take on the persona of an Apprentice Coder adventuring through regional software domains, unlocking knowledge tomes, defeating buggy monsters and dungeon guardians in combat trials, and crafting real algorithms in hands-on code arenas.

```
🗺️ WORLD MAP ───► 🌲 REGION HUB ───► 📖 LEARN (Grimoire) ───► ⚔️ QUEST (Combat MCQ)
                                                                       │
🏆 LEADERBOARDS ◄─── 🪙 REWARDS / XP ◄─── 💻 PRACTICE (Code Arena) ◄──┘
```

---

## 🏛️ Core Gameplay & Pedagogical Loop

1. **🗺️ World Map (`/world-map`)**: Interactive cartography across 6 thematic Python and CS domains with dynamic prerequisite paths, fog-of-war states, and boss apex alerts.
2. **🌲 Region Hub (`/regions/[slug]`)**: Domain lore, boss profile, and a unified **Triple Mastery Panel** tracking:
   - **Step 1: Knowledge Tomes** — Theory, code examples, checkpoint rites.
   - **Step 2: Battle Trials** — Gamified MCQ combat encounters with immediate lore feedback.
   - **Step 3: Coding Practice** — Live, editable Python challenges with deterministic automated test cases.
3. **📖 Knowledge Grimoire (`/learn` & `/learn/[id]`)**: Deep-dive conceptual documentation, syntax breakdowns, and interactive checkpoint rites.
4. **⚔️ Quest Board & Boss Dungeons (`/quests` & `/quests/[id]`)**: Dynamic MCQ combat arena featuring health counters, streak multipliers, and XP/Gold bounties.
5. **💻 Coding Practice Hall & Arena (`/practice` & `/practice/[challengeId]`)**: Real-time Python code editor with dual-panel layout, test case execution drawer, multi-tier progressive hints, and sandboxed deterministic verification.
6. **🗡️ The Forge (`/forge`)**: Weapon crafting, tier upgrades, and elemental stat enhancements powered by Arcane Gold.
7. **🏆 Leaderboards (`/leaderboard`)**: Regional and realm-wide rankings tracking total XP, streak flames, and combat ranks.
8. **⚡ Instant Demo Mode**: Zero-friction offline prototype mode persisting player progression, combat history, and practice submissions across browser sessions.

---

## 🗺️ The Realm of Python

| Region | Level | Domain Focus | Dungeon Boss | Status |
|--------|-------|--------------|--------------|--------|
| **Python Village** | Lv. 1–3 | Variables, Types, Operators & I/O | Syntax Serpent | Available |
| **Logic Forest** | Lv. 4–7 | Conditionals, While/For Loops, Nesting | While-Loop Wraith | Available |
| **Function Wastes** | Lv. 8–12 | Def, Scope, Recursion & Lambdas | Recursion Hydra | Prereq: Logic Forest |
| **Data Mines** | Lv. 13–17 | Lists, Tuples, Dicts, Sets & Slicing | Pointer Golem | Prereq: Function Wastes |
| **OOP Citadel** | Lv. 18–23 | Classes, Inheritance, Polymorphism | Monolith Overlord | Prereq: Data Mines |
| **Python Summit** | Lv. 24–30 | Algorithms, Async, Decorators & Meta | The Null Dragon | Boss Apex |

---

## 🛠️ Technology Stack

### Frontend & Game Shell
- **Next.js 14** (App Router, Server & Client Components)
- **TypeScript** (Strict type definitions across all game mechanics)
- **Tailwind CSS & CSS Variables** (Custom DEVKIT Dark Fantasy Design System)
- **Centralized Progression Engine** (`lib/progression.ts`) — Pure functional state calculators ensuring synchronized unlock states across all routes.
- **Client-Side Storage Engine** (`lib/demo.ts`) — Multi-tab reactive `localStorage` persistence with zero server prerequisites.

### Backend REST API (`server/`)
- **Node.js + Express.js**
- **Prisma ORM** + **PostgreSQL**
- **JWT Authentication** + Role & Class Guards
- **XP, Leveling, and Badge Calculation Engines**

### AI Intelligence Service (`devkit-ai/`)
- **FastAPI (Python 3.10+)**
- **Groq API** (Llama 3.1 70B & 8B)
- **AXIOM Dual-Mode Persona**: Academic Professor vs. Dramatic Fantasy Narrator

---

## 📁 Repository Structure

```
devkit-app/
├── app/
│   ├── (auth)/                 # Dark fantasy Login & Signup screens
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (game)/                 # Authenticated Game Layout & Navigation
│   │   ├── dashboard/page.tsx  # Game HUD, Active Journey Trio, Domain Breakdown
│   │   ├── world-map/page.tsx  # Interactive SVG Map with illuminated paths
│   │   ├── regions/[slug]/     # Dynamic Region Hub with Triple Mastery Steps
│   │   ├── learn/              # Knowledge Grimoire & Tome Reader
│   │   ├── quests/             # Combat Quest Board & MCQ Battle Arena
│   │   ├── practice/           # Coding Training Grounds & Interactive Code Arena
│   │   ├── forge/page.tsx      # Weapon Upgrading & Arcane Stat Forge
│   │   ├── leaderboard/        # Realm Rankings & Combat Leaderboard
│   │   └── layout.tsx          # Top Header HUD & Responsive Mobile Navigation
│   ├── globals.css             # Design System Tokens, Animations, Theme Palette
│   └── layout.tsx              # Root Layout with AuthProvider
├── components/
│   ├── Badge.tsx               # Rarity, Difficulty, and Status Badges
│   ├── Button.tsx              # Primary, Accent, Gold, Danger RPG Buttons
│   ├── Card.tsx                # DevkitCard, StatCard, Panel wrappers
│   ├── DevkitLogo.tsx          # Illuminated DEVKIT Brand Symbol
│   ├── LoadingState.tsx        # Arcane Loaders & Skeleton States
│   ├── Modal.tsx               # Modal dialogue containers
│   ├── XPBar.tsx               # Animated XP & Progress Bars
│   └── quest/
│       ├── MCQQuestion.tsx     # Interactive Combat Question Component
│       └── QuestComplete.tsx   # Victory Dialog & Loot Summary Modal
├── lib/
│   ├── AuthContext.tsx         # Unified Authentication & Demo Mode Context
│   ├── demo.ts                 # Centralized Demo Game State & Storage Engine
│   ├── gameData.ts             # Static Regions & Quests Catalog
│   ├── learningData.ts         # Static Knowledge Tomes & Checkpoint Catalog
│   ├── practiceData.ts         # Static Python Challenges, Tests & Evaluator
│   └── progression.ts          # Single Source of Truth Progression Calculators
├── types/
│   └── index.ts                # TypeScript interfaces for users, items, quests
└── server/                     # Express.js REST API with Prisma ORM
    ├── controllers/
    ├── routes/
    ├── prisma/
    │   └── schema.prisma       # Database Schema
    └── app.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** & `npm`
- *(Optional)* Docker Desktop for PostgreSQL & Redis
- *(Optional)* Python 3.10+ for `devkit-ai` service

### 1. Quick Start (Demo Mode — Instant Play)
No database setup required! Run the frontend directly:

```bash
# Clone the repository
git clone https://github.com/Moiz-Mohammed/devkit-app.git
cd devkit-app

# Install dependencies
npm install

# Start Next.js Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **"ENTER DEMO"** or sign in to enter the realm.

---

### 2. Full-Stack Setup (With PostgreSQL Backend)

```bash
# Set up Express Server & Database
cd server
npm install
cp .env.example .env

# Run Prisma migrations & seed initial database
npm run db:migrate
npm run db:seed

# Start backend server (runs on port 5000)
npm run dev
```

---

### 3. Running AI Service (AXIOM)

```bash
cd ../devkit-ai
pip install -r requirements.txt
cp .env.example .env  # Add your GROQ_API_KEY from console.groq.com

# Start FastAPI server
python -m uvicorn src.api.app:app --reload --port 8000
```

---

## 🧪 Verification & Testing

Run the test suites to verify progression integrity, code evaluations, and builds:

```bash
# TypeScript Type Check
npx tsc --noEmit

# Production Build
npm run build
```

---

## 📜 License

Created for the DEVKIT Platform Initiative. Built with ❤️ for computer science educators and learners worldwide.

