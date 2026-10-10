# 🛡️ DEVKIT — Project Architecture & File-by-File Guide

This document provides a comprehensive overview of every single file created or configured so far in **DEVKIT** across both the **devkit-app** (App & API Server) and **devkit-ai** (AI Microservice) repositories.

---

## 📁 Repository 1: `devkit-app` (Web Frontend & Express Backend)
This repository contains the Next.js 14 Web Frontend, and the Express.js Backend API server located in `/server`.

### 🌐 Frontend Directory (`/devkit-app`)

#### 🛠️ Config & Environments
*   **[`/package.json`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/package.json)**
    Manages frontend Node.js dependencies including `next`, `react`, `react-dom`, `axios`, `js-cookie`, `zustand`, and devDependencies for `tailwindcss` and `typescript`.
*   **[`/tsconfig.json`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/tsconfig.json)**
    TypeScript configuration mapping import paths (e.g. mapping `@/*` to the project root directory).
*   **[`/.env.local`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/.env.local)**
    Contains client-side environment configurations. Sets `NEXT_PUBLIC_API_URL` to point to the backend Express server at `http://localhost:5000`.
*   **[`/docker-compose.yml`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/docker-compose.yml)**
    Configures local Docker services: **PostgreSQL** (running on port `5432`) and **Redis** (running on port `6379`) used for caching and sessions.
*   **[`/middleware.ts`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/middleware.ts)**
    Next.js edge middleware executing redirect protection:
    *   Blocks users from visiting game pages `/dashboard` if they lack a cookie token (redirects to `/login`).
    *   Blocks logged-in users from hitting `/login` or `/signup` (redirects to `/dashboard`).

#### 🎨 Layouts, CSS & App Setup
*   **[`/app/layout.tsx`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/app/layout.tsx)**
    The root wrapper of the frontend. Injects SEO metadata (titles, descriptions, keywords), preload tags for Google fonts, and imports the `AuthProvider` component to track sessions application-wide.
*   **[`/app/globals.css`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/app/globals.css)**
    The global theme sheet implementing:
    *   **Colors**: CSS variables defining dark theme base (`#0a0a0f`), surface values, primary purple hues, cyan offsets, and Amber gold for XP rewards.
    *   **UI Tokens**: Form input styles (`.devkit-input`), buttons (`.btn-primary`), progression layouts (`.xp-bar`), and card components.
    *   **Animations**: Glow states, shimmers, and character floating animations (`.animate-float`).

#### 🔑 Authentication Pages
*   **[`/app/(auth)/layout.tsx`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/app/(auth)/layout.tsx)**
    Shared layout for login/signup pages. Implements a responsive split-pane UI: a left panel showing DEVKIT RPG marketing, stats, and quotes, and a right panel wrapping the input forms.
*   **[`/app/(auth)/login/page.tsx`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/app/(auth)/login/page.tsx)**
    The login screen. Performs form validation and calls `login()` from the AuthContext. Includes error states and clean spinner loaders.
*   **[`/app/(auth)/signup/page.tsx`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/app/(auth)/signup/page.tsx)**
    The registration screen. Features a custom **password strength meter** checking length, capitalization, and numbers.

#### 🎮 Game Pages & Onboarding
*   **[`/app/onboarding/page.tsx`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/app/onboarding/page.tsx)**
    Interactive multi-step questionnaire that new users see. Users select their coding experience, daily time limits, and choose their primary starting Career Class (e.g. Python Developer or ML Engineer). Once finished, it invokes `POST /api/characters` to forge their game character.
*   **[`/app/(game)/layout.tsx`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/app/(game)/layout.tsx)**
    The layout shell wrapping all game routes. Displays a top navigation bar showing link routes, user's current character level, total XP, and user avatar.
*   **[`/app/(game)/dashboard/page.tsx`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/app/(game)/dashboard/page.tsx)**
    The main game screen. Renders player level progression bars, current streak meters, global ranks, active quest trackers, and placeholders for characters and weapon loadouts.

#### 🛠️ Frontend Core Utilities
*   **[`/types/index.ts`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/types/index.ts)**
    Core TypeScript interfaces for database items (e.g. `User`, `Character`, `CareerClass`, `UserXP`, `Streak`, `Resource`).
*   **[`/lib/auth.ts`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/lib/auth.ts)**
    Accesses/deletes authentication tokens stored inside cookies and `localStorage`. Includes expiry helper checks.
*   **[`/lib/api.ts`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/lib/api.ts)**
    Custom Axios client. Includes request interceptors to auto-attach authorization header tokens, and response interceptors to catch expired token errors and execute background JWT refreshes automatically.
*   **[`/lib/AuthContext.tsx`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/lib/AuthContext.tsx)**
    React context managing application-wide state. Checks user sessions on boot and exposes `login`, `signup`, `logout`, and status properties.

---

### 🖥️ Express Backend Directory (`/devkit-app/server`)

#### 🛠️ Core Configuration
*   **[`/server/package.json`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/package.json)**
    Backend dependencies: `express`, `@prisma/client` (ORM), `bcryptjs` (hashing), `cors`, `jsonwebtoken` (auth), `express-rate-limit` (security), and `zod` (validation).
*   **[`/server/app.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/app.js)**
    Entry script loading all routers (`auth`, `users`, `characters`, `quests`, etc.), sets up global CORS, JSON parsing, rate limiters, and configures an error handling middleware wrapper.
*   **[`/server/.env`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/.env)**
    Configuration variables for the database URL, port, JWT secrets, and AI service paths.

#### 🗄️ Database & Prisma ORM
*   **[`/server/prisma/schema.prisma`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/prisma/schema.prisma)**
    Our PostgreSQL schema structure, defining models for users, game characters, career paths, levels, weapons, subjects, resources, and social interactions.
*   **[`/server/prisma/seed.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/prisma/seed.js)**
    Database seeder populating initial game content, including the 6 starting career roles (e.g. Python Developer, ML Engineer) and basic Python subjects.

#### 🧩 Middleware & Utils
*   **[`/server/middleware/auth.middleware.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/middleware/auth.middleware.js)**
    Verifies incoming Authorization bearer tokens and attaches the verified user payload (`id`, `email`, `role`) to the request object. Includes admin-only guard routes.
*   **[`/server/middleware/rateLimit.middleware.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/middleware/rateLimit.middleware.js)**
    Rate limiters preventing API abuse. Restricts login/signup endpoints to 10 requests per 15 minutes, and other general endpoints to 100 requests per 15 minutes.
*   **[`/server/middleware/error.middleware.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/middleware/error.middleware.js)**
    Catch-all express middleware log formatter returning standard error messages to clients.
*   **[`/server/utils/jwt.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/utils/jwt.js)**
    Signs and verifies short-lived access tokens and long-lived refresh tokens.
*   **[`/server/utils/prisma.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/utils/prisma.js)**
    Prisma Client singleton. Prevents opening excessive database connections during development hot-reloads.

#### 🛣️ Controllers & Routing
*   **[`/server/controllers/auth.controller.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/controllers/auth.controller.js)**
    Auth business logic handlers (validations, password hashing, and user creation).
*   **[`/server/routes/auth.routes.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/routes/auth.routes.js)**
    Maps public route paths `/login` and `/signup` directly to the auth controllers.
*   **[`/server/controllers/character.controller.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/controllers/character.controller.js)**
    Handles character creation logic for onboarding, mapping a user's selection to one of the seeded career classes.
*   **[`/server/routes/character.routes.js`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/server/routes/character.routes.js)**
    Exposes POST `/` and GET `/me` endpoints to create and retrieve user characters.

---

## 📁 Repository 2: `devkit-ai` (AI Microservice)
This Python FastAPI service acts as the brain for the companion, **AXIOM**.

*   **[`/requirements.txt`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/requirements.txt)**
    Lists Python dependencies: `fastapi`, `uvicorn` (server), `groq` (LLM inference), `python-dotenv`, and `pydantic`.
*   **[`/.env.example`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/.env.example)**
    Template configuration for microservice ports, API keys, and model paths (e.g. Groq vs Ollama).
*   **[`/src/api/app.py`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/src/api/app.py)**
    FastAPI app setup config with devkit-app CORS access allowances and routing bindings.
*   **[`/src/api/routes/chat.py`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/src/api/routes/chat.py)**
    Streaming chat endpoint. Intercepts queries, fetches user state variables, feeds context into prompts, and returns a stream of text chunks.
*   **[`/prompts/system_prompt.txt`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/prompts/system_prompt.txt)**
    AXIOM system prompt defining:
    *   **Mentor Mode**: Clear, patient explanation style using code snippets.
    *   **Quest Mode**: Cinematic, narrative second-person text framing.
*   **[`/src/core/prompt_builder.py`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/src/core/prompt_builder.py)**
    Constructs the contextual system prompt by reading state variables (e.g. active quest, level, streaks) and appending them before sending requests to the LLM.
*   **[`/src/core/memory.py`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/src/core/memory.py)**
    Saves message history and executes background summarizations when conversation length grows, keeping API token costs low.
*   **[`/src/core/rate_limiter.py`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/src/core/rate_limiter.py)**
    Protects Groq free tier limiters by restricting requests per user to 20 per day.
*   **[`/src/models/groq_client.py`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-ai/src/models/groq_client.py)**
    Wrapper client running asynchronous inference calls to Groq endpoint targets (`llama-3.1-70b-versatile`).

---

## 📘 Companion Documentation Files
*   **[`RESOURCE_CATALOGUE_GUIDE.md`](file:///c:/Users/User/OneDrive/Desktop/Dev%20learning%20platform/devkit-app/RESOURCE_CATALOGUE_GUIDE.md)**
    A developer implementation guide for the Resource Catalogue page, written to help team members work on this feature independently.
