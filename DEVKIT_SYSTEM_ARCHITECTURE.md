# 🏛️ DEVKIT — System & Design Architecture

This document describes the high-level system topology, data flow pipelines, and service boundaries of **DEVKIT**.

---

## 🗺️ System Topology Diagram

The diagram below represents the system components and their relationships:

```mermaid
graph TD
    %% Client Tier
    subgraph Client ["Client Tier (Next.js)"]
        UI["Web Interface (React components)"]
        Context["AuthContext & API Client (Axios)"]
    end

    %% Routing / Protection Gate
    Middleware{"Next.js Route Middleware"}
    UI --> Middleware

    %% API Backend Tier
    subgraph AppServer ["Backend API Tier (Express.js)"]
        Express["Express App (app.js)"]
        Controller["Controllers (auth, character, quest)"]
        PrismaClient["Prisma ORM Client"]
        JWT["JWT Utilities (Token Pairs)"]
    end

    Middleware -- API Requests --> Express
    Express --> Controller
    Controller --> JWT
    Controller --> PrismaClient

    %% Database / Storage Tier
    subgraph Storage ["Database & Storage Tier"]
        DB[(PostgreSQL Database)]
        Cache[(Redis Cache)]
    end

    PrismaClient --> DB
    Express -- Streaks / Rate Limits --> Cache

    %% AI service Tier
    subgraph AIService ["AI Tier (FastAPI)"]
        FastAPI["FastAPI Entry (app.py)"]
        Builder["Prompt Builder (Context Injector)"]
        Limiter["Rate Limiter & Memory Manager"]
        GroqClient["Groq LLM Client"]
    end

    Controller -- HTTP Chat Request --> FastAPI
    FastAPI --> Builder
    FastAPI --> Limiter
    FastAPI --> GroqClient
    
    %% External Model APIs
    LLM["Groq API (Llama 3.1 70B)"]
    GroqClient -- Streaming Stream --> LLM
    LLM -- SSE Chunks --> UI
```

---

## ⚡ Key Data Flow Pipelines

### 1. User Authentication & Authorization Flow
1.  **Request**: User types credentials on `/login` and hits submit.
2.  **Next.js Client**: `AuthContext` calls `authApi.login()`.
3.  **Express Backend**:
    *   `rateLimit.middleware` checks Redis/memory counters to prevent brute-force attacks.
    *   `auth.controller` validates email format via Zod schemas.
    *   Bcrypt compares the submitted password against the hash in the **PostgreSQL** database.
    *   If correct, `jwt.js` signs a short-lived **Access Token** (stored in cookies/localStorage) and a long-lived **Refresh Token** (stored in cookies).
4.  **Next.js Middleware**: Automatically inspects cookie credentials to unlock paths starting with `/dashboard` or `/quests`.

### 2. Conversational Companion Flow (AXIOM)
1.  **Trigger**: User sends a message in Mentor or Quest mode.
2.  **Express Backend**: Checks the user's active session, retrieves stats (Level, XP, Class) from PostgreSQL, and forwards the conversation to the AI Microservice.
3.  **FastAPI AI Server**:
    *   `rate_limiter.py` checks usage quotas (20 messages/day limit).
    *   `prompt_builder.py` reads user parameters and formats the `system_prompt.txt` instructions.
    *   `memory.py` injects previous conversation summary fragments to keep context windows compact.
4.  **Groq Client**: Passes parameters to the Groq API endpoint.
5.  **Streaming Delivery**: Text fragments stream from Groq back to FastAPI, then pass straight through Express directly to the React interface via **Server-Sent Events (SSE)**.

---

## 🛡️ Service Separation (App vs AI Repositories)

| Feature | App Service (`devkit-app`) | AI Service (`devkit-ai`) |
| :--- | :--- | :--- |
| **Primary Language** | TypeScript / JavaScript (Node.js) | Python |
| **Responsibilities** | User Auth, Progress Tracking, Quests Engine, Weapon Crafting, DB Management | Natural Language Mentoring, Game Quest Narrative, Code Explanation |
| **Storage Connects** | Direct connection to PostgreSQL and Redis | Stateless (fetches user profile data on-demand) |
| **LLM Inference** | None | Interacts directly with Groq API / Ollama engines |
