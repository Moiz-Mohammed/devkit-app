# 📚 Resource Catalogue — Developer Guide

> **Owner:** Your Name  
> **Branch:** `feature/resource-catalogue`  
> **Depends on:** Auth system (done), Prisma schema (done)  
> **Deadline suggestion:** 1 week sprint

---

## 🎯 What You're Building

A browsable, filterable, gamified resource library where users can discover curated learning materials (articles, courses, docs, books, tools) and YouTube videos. Resources are **locked by default** and unlocked by completing quests — this ties the catalogue into the game loop.

### User Stories
1. As a user, I can browse all subjects (Python, JS, etc.) and see their topics
2. As a user, I can view resources per topic, filtered by type and difficulty
3. As a user, I can see which resources are locked vs unlocked for me
4. As a user, I can rate resources (1–5 stars) and see average ratings
5. As a user, I can watch embedded YouTube videos from the catalogue
6. As an admin, I can add/edit/remove resources and videos via API

---

## 🗄️ Database Models (Already Created)

All models are already defined in `server/prisma/schema.prisma`. **Do NOT modify the schema** — just use these models as-is.

### Models You'll Work With

| Model | Purpose | Key Fields |
|---|---|---|
| `Subject` | Top-level category (Python, JS) | `name`, `slug`, `regionName`, `isUnlocked`, `orderIndex` |
| `Topic` | Sub-category within a subject | `name`, `dungeonName`, `orderIndex`, `isLocked`, `subjectId` |
| `Resource` | A learning material (article, course, etc.) | `title`, `url`, `type`, `isPaid`, `isLocked`, `difficulty`, `topicId`, `subjectId` |
| `ResourceUnlock` | Tracks which user unlocked which resource | `userId`, `resourceId`, `method` |
| `Video` | YouTube video tied to a subject | `youtubeId`, `title`, `channelName`, `duration`, `difficulty`, `isFeatured` |
| `Rating` | User rating (1–5) for resource or video | `userId`, `resourceId`, `videoId`, `score` |

### Key Relationships
```
Subject ──has many──> Topic ──has many──> Resource
Subject ──has many──> Video
Resource ──has many──> ResourceUnlock (per user)
Resource ──has many──> Rating
Video ──has many──> Rating
```

---

## 🔧 Backend — What to Implement

### Files to Edit/Create

| File | Status | What to Do |
|---|---|---|
| `server/routes/resource.routes.js` | EXISTS (stub) | Add all routes below |
| `server/routes/subject.routes.js` | EXISTS (stub) | Add all routes below |
| `server/controllers/resource.controller.js` | EXISTS (stub) | Implement controller logic |
| `server/controllers/subject.controller.js` | CREATE | New controller |
| `server/controllers/video.controller.js` | CREATE | New controller |
| `server/prisma/seed.js` | EXISTS | **Extend** — add resources + videos seed data |

### API Endpoints to Build

#### Subjects & Topics
```
GET    /api/subjects                  → List all subjects (with topic counts)
GET    /api/subjects/:slug            → Single subject with all its topics
GET    /api/subjects/:slug/topics     → Topics for a subject (with quest/resource counts)
```

#### Resources
```
GET    /api/resources                 → All resources (filterable)
GET    /api/resources/:id             → Single resource detail
POST   /api/resources                 → [ADMIN] Create resource
PUT    /api/resources/:id             → [ADMIN] Update resource
DELETE /api/resources/:id             → [ADMIN] Delete resource
POST   /api/resources/:id/rate        → [AUTH] Rate a resource (1–5)
GET    /api/resources/unlocked        → [AUTH] User's unlocked resources
```

#### Videos
```
GET    /api/subjects/:slug/videos     → Videos for a subject
POST   /api/subjects/:slug/videos     → [ADMIN] Add a video
POST   /api/videos/:id/rate           → [AUTH] Rate a video
```

### Query Filter Params (GET /api/resources)
```
?subject=python           → Filter by subject slug
?topic=python-basics      → Filter by topic
?type=article             → Filter by type (article|course|documentation|book|tool)
?difficulty=beginner      → Filter by difficulty (beginner|intermediate|advanced)
?isPaid=false             → Free resources only
?search=regex             → Text search on title/description
?page=1&limit=20          → Pagination
?sort=rating              → Sort by avg rating, newest, difficulty
```

### Controller Pattern (follow the auth controller style)
```javascript
// server/controllers/resource.controller.js
const prisma = require('../utils/prisma');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const getResources = async (req, res, next) => {
  try {
    const { subject, topic, type, difficulty, isPaid, search, page = 1, limit = 20, sort } = req.query;
    
    const where = {};
    if (subject)    where.subject = { slug: subject };
    if (topic)      where.topic = { id: topic };
    if (type)       where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (isPaid !== undefined) where.isPaid = isPaid === 'true';
    if (search)     where.title = { contains: search, mode: 'insensitive' };

    const resources = await prisma.resource.findMany({
      where,
      include: {
        subject: { select: { name: true, slug: true } },
        topic: { select: { name: true } },
        ratings: { select: { score: true } },
        // Check if current user has unlocked this resource
        unlocks: req.user ? { where: { userId: req.user.id } } : false,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    // Calculate average rating for each resource
    const enriched = resources.map(r => ({
      ...r,
      avgRating: r.ratings.length 
        ? (r.ratings.reduce((sum, rt) => sum + rt.score, 0) / r.ratings.length).toFixed(1)
        : null,
      ratingCount: r.ratings.length,
      isUnlockedByUser: r.unlocks?.length > 0,
    }));

    res.json({ resources: enriched });
  } catch (err) {
    next(err);
  }
};
```

### Rate Limiting
Use the existing `apiLimiter` from `server/middleware/rateLimit.middleware.js` on all GET routes. Use `authLimiter` on POST/PUT/DELETE.

---

## 🎨 Frontend — What to Build

### Pages

| Route | File | What It Shows |
|---|---|---|
| `/resources` | `app/resources/page.tsx` | Main catalogue with filters sidebar + resource grid |
| `/resources/[slug]` | CREATE: `app/resources/[slug]/page.tsx` | Subject-specific view with topics accordion |

### Components to Implement

| Component | File | Purpose |
|---|---|---|
| `ResourceCard` | `components/resource/ResourceCard.tsx` | Card showing resource title, type badge, difficulty, rating, lock state |
| `VideoCard` | `components/resource/VideoCard.tsx` | YouTube embed/thumbnail with play button, duration, channel |
| `ResourceFilters` | CREATE: `components/resource/ResourceFilters.tsx` | Sidebar with filter checkboxes: type, difficulty, free/paid |
| `StarRating` | CREATE: `components/ui/StarRating.tsx` | Interactive 1–5 star rating component |

### Design Rules (MUST FOLLOW)

Use the existing design system in `app/globals.css`. Here are the classes/tokens to use:

```css
/* Cards */
.devkit-card              → All resource cards

/* Badges for difficulty */
.devkit-badge .badge-green   → Beginner
.devkit-badge .badge-violet  → Intermediate  
.devkit-badge .badge-red     → Advanced

/* Badges for type */
.devkit-badge .badge-cyan    → Article / Documentation
.devkit-badge .badge-gold    → Course / Book

/* Lock states */
/* Locked: Add opacity-50 and a 🔒 icon overlay */
/* Unlocked: Normal state with full opacity */

/* Buttons */
.btn-primary              → Main actions (unlock, view)
.btn-secondary            → Filters, secondary actions
.btn-ghost                → Small inline actions (rate, share)

/* Inputs */
.devkit-input             → Search bar, filter inputs

/* Glass panels */
.glass                    → Filter sidebar background
.glass-strong             → Sticky header sections

/* Colors (use CSS variables) */
var(--brand-primary)      → #7c3aed (violet — primary accents)
var(--brand-secondary)    → #06b6d4 (cyan — links, info)
var(--brand-accent)       → #f59e0b (gold — ratings, XP)
var(--bg-surface)         → Card backgrounds
var(--bg-elevated)        → Hover states, inputs
var(--text-primary)       → #f0f0ff (headings)
var(--text-secondary)     → #8b8ba8 (body text)
var(--text-muted)         → #4a4a6a (metadata)
```

### ResourceCard Layout
```
┌─────────────────────────────────────────┐
│  [TYPE BADGE]   [DIFFICULTY BADGE]  🔒  │
│                                         │
│  Resource Title                         │
│  Short description text...              │
│                                         │
│  ⭐ 4.2 (12 ratings)    📚 Python      │
│  [View Resource →]                      │
└─────────────────────────────────────────┘
```

### API Integration
Use the existing Axios client from `lib/api.ts`:
```typescript
import api from '@/lib/api';

// Fetch resources
const { data } = await api.get('/resources', { params: { subject: 'python', difficulty: 'beginner' } });

// Rate a resource
await api.post(`/resources/${id}/rate`, { score: 4 });
```

---

## 📦 Seed Data to Add

Extend `server/prisma/seed.js` with real resources. Source material is in the `learning_platform/` folder — use those curated `.md` files. Example:

```javascript
// Add after the topic seeding section
const resources = [
  {
    title: 'Python Official Tutorial',
    url: 'https://docs.python.org/3/tutorial/',
    type: 'documentation',
    isPaid: false,
    isLocked: false,  // starter resources are free
    difficulty: 'beginner',
    description: 'The official Python tutorial from python.org',
    subjectId: pythonSubject.id,
    topicId: pythonBasicsTopic.id,
  },
  // ... add 10-20 resources per topic from learning_platform/*.md files
];
```

---

## ✅ Checklist

```
Backend:
[ ] Create subject.controller.js
[ ] Create video.controller.js  
[ ] Implement resource.controller.js (CRUD + filtering + rating)
[ ] Wire subject.routes.js
[ ] Wire resource.routes.js
[ ] Extend seed.js with 20+ real resources from learning_platform/*.md
[ ] Test all endpoints with curl/Postman

Frontend:
[ ] Implement ResourceCard component
[ ] Implement VideoCard component
[ ] Create ResourceFilters sidebar component
[ ] Create StarRating reusable component
[ ] Build /resources page with grid + filters
[ ] Create /resources/[slug] subject detail page
[ ] Wire API calls with lib/api.ts
[ ] Add lock/unlock visual states
[ ] Test responsive layout (mobile + desktop)

Integration:
[ ] Verify locked resources show 🔒 for new users
[ ] Verify unlocked resources show full content
[ ] Verify rating persists and averages update
[ ] Verify filter combinations work together
```

---

## 🚫 Don't Touch These Files
- `server/prisma/schema.prisma` — schema is locked
- `app/globals.css` — design system is locked
- `app/layout.tsx` — root layout is locked
- `lib/AuthContext.tsx` — auth is locked
- `lib/api.ts` — API client is locked
- `middleware.ts` — route guards are locked

---

## 🔀 Git Workflow
```bash
git checkout -b feature/resource-catalogue
# ... do your work ...
git add .
git commit -m "feat: resource catalogue — browsable, filterable, rated"
git push origin feature/resource-catalogue
# Then open a PR to main
```

Questions? Ask in the group chat or ping @Moiz-Mohammed.
