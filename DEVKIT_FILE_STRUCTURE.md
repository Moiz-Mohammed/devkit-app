# 📁 DEVKIT — Directory & File Structure

Below is the directory structure layout for both repositories inside the `Dev learning platform` workspace.

---

## 🌐 1. `devkit-app` Repository (Frontend & Backend)

```
devkit-app/
├── app/                              # Next.js App Router Pages
│   ├── (auth)/                       # Protected Auth Routes
│   │   ├── login/
│   │   │   └── page.tsx              # Login Screen UI
│   │   ├── signup/
│   │   │   └── page.tsx              # Signup Screen UI
│   │   └── layout.tsx                # Branded Left Sidebar layout
│   ├── (game)/                       # Gamified Screens
│   │   ├── dashboard/
│   │   │   └── page.tsx              # User progression dashboard page
│   │   ├── forge/
│   │   ├── help-board/
│   │   ├── leaderboard/
│   │   ├── profile/
│   │   ├── quests/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Dynamic quest detail route
│   │   ├── world-map/
│   │   └── layout.tsx                # Game navigation and stats bar layout
│   ├── onboarding/
│   │   └── page.tsx                  # Career class select questionnaire
│   ├── globals.css                   # Tailwind v4 theme and design tokens
│   └── layout.tsx                    # Root Next.js wrapper and Auth Context provider
├── components/                       # Reusable Frontend Components
│   ├── game/                         # Game system UI (Weapons, Bosses, Map)
│   ├── layout/                       # Navbar, Sidebar, Footer wrappers
│   ├── quest/                        # Card items, MCQ interfaces
│   ├── resource/                     # Resource lists, video players
│   └── ui/                           # Base design primitives (Buttons, Cards)
├── hooks/                            # React Custom hooks (useAuth, useXP, etc.)
├── lib/                              # Frontend library helpers
│   ├── api.ts                        # Axios API Client with Auto-Refresh
│   ├── auth.ts                       # Token cookie getters & setters
│   └── AuthContext.tsx               # Session Context Provider
├── server/                           # Express.js REST API Server
│   ├── controllers/                  # Core Endpoint controllers
│   │   ├── auth.controller.js        # Signup, Login, Profile controllers
│   │   └── character.controller.js   # Character onboarding controller
│   ├── middleware/                   # Express routes filters
│   │   ├── auth.middleware.js        # JWT parser & route guards
│   │   ├── error.middleware.js       # JSON error handlers
│   │   └── rateLimit.middleware.js   # API request limit counters
│   ├── prisma/                       # Database configurations
│   │   ├── schema.prisma             # PostgreSQL schemas
│   │   └── seed.js                   # Mock data initialization scripts
│   ├── routes/                       # Express router map
│   │   ├── auth.routes.js            # Auth routing targets
│   │   └── character.routes.js       # Character onboarding targets
│   ├── utils/                        # Utility helpers
│   │   ├── jwt.js                    # JWT token signers
│   │   └── prisma.js                 # Prisma client instance singleton
│   ├── app.js                        # API Gateway main configuration script
│   └── package.json                  # Backend dependencies
├── types/                            # Frontend interface model definitions
├── docker-compose.yml                # local PostgreSQL & Redis Docker setup
├── middleware.ts                     # Next.js Route Guard Middleware
├── package.json                      # Frontend App dependencies
└── tsconfig.json                     # TypeScript path compilers
```

---

## 🤖 2. `devkit-ai` Repository (FastAPI Microservice)

```
devkit-ai/
├── src/                              # Service Core
│   ├── api/                          # FastAPI App configuration
│   │   ├── routes/
│   │   │   └── chat.py               # Streaming chat context router
│   │   └── app.py                    # App routing mappings and CORS setup
│   ├── core/                         # Logical Controllers
│   │   ├── memory.py                 # Rolling summaries context compression
│   │   ├── prompt_builder.py         # Dynamic prompt constructor (Context Injector)
│   │   └── rate_limiter.py           # Message count limit check limits
│   └── models/
│       └── groq_client.py            # Llama 3.1 LLM target connectors
├── prompts/
│   └── system_prompt.txt             # AXIOM character script modes (Mentor / Quest)
├── README.md                         # Teammate usage guidelines
├── requirements.txt                  # Python libraries (fastapi, groq)
└── .env.example                      # Server environment config templates
```
