# 🛠️ DEVKIT — App Repository

> Gamified CSE learning platform. Learn like you're playing. Master like you mean it.

## Repo Structure

```
devkit-app/
├── app/                    # Next.js 14 pages (App Router)
│   ├── (auth)/             # Login, Signup
│   └── (game)/             # Dashboard, World Map, Quests, Forge, etc.
├── components/
│   ├── ui/                 # Reusable UI: Button, Card, Modal, Badge
│   ├── game/               # Character, Weapon, SkillTree, BossFight, WorldMap
│   ├── quest/              # QuestCard, MCQ, BossQuestForm
│   ├── resource/           # ResourceCard, VideoCard
│   └── layout/             # Navbar, Sidebar, Footer
├── hooks/                  # Custom React hooks
├── lib/                    # API client, auth helpers, utils
├── types/                  # TypeScript interfaces
├── public/assets/          # Characters, weapons, bosses, world map art
├── server/                 # Express.js REST API
│   ├── routes/             # All API route definitions
│   ├── controllers/        # Business logic handlers
│   ├── middleware/         # Auth guard, rate limiter, error handler
│   ├── services/           # XP engine, quest engine, leaderboard, badges
│   ├── utils/              # Shared helpers
│   └── prisma/             # schema.prisma — full DB schema
└── docker-compose.yml      # Local Postgres + Redis
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop (for local Postgres + Redis)
- npm

### 1. Start the database
```bash
docker-compose up -d
```

### 2. Set up the frontend
```bash
npm install
cp .env.local.example .env.local   # fill in values
npm run dev                         # runs on http://localhost:3000
```

### 3. Set up the backend
```bash
cd server
npm install
cp .env.example .env                # fill in values
npm run db:migrate                  # run Prisma migrations
npm run db:seed                     # seed initial data
npm run dev                         # runs on http://localhost:5000
```

### 4. Open the app
Visit [http://localhost:3000](http://localhost:3000)

## Team A Contacts
- Frontend: Next.js pages in `app/`, components in `components/`
- Backend: Express API in `server/`
- DB Schema: `server/prisma/schema.prisma`
- Connect to AI Service: `server/routes/` → calls `AI_SERVICE_URL`

## Key API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/subjects` | All subjects/regions |
| GET | `/api/quests` | Quest list |
| POST | `/api/quests/:id/submit` | Submit quest answer |
| GET | `/api/skill-tree/:subject` | Skill tree data |
| GET | `/api/leaderboard` | Weekly leaderboard |
| POST | `/api/duels` | Challenge a user |
| GET | `/api/characters/:userId` | User character |

## Environment Variables
Copy `server/.env.example` to `server/.env` and fill in:
- `DATABASE_URL` — Postgres connection string
- `REDIS_URL` — Redis connection string
- `JWT_SECRET` — Secret for signing tokens
- `AI_SERVICE_URL` — URL of the devkit-ai service

## Reference Files
The original `learning_platform/` folder contains curated `.md` files with all CSE resources — use these to seed the database.
