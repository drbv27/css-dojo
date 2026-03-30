# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev       # Start Next.js dev server

# Build & lint
npm run build
npm run lint
```

No test suite is configured.

## Environment Variables

Create a `.env.local` file in the project root with:

```
MONGODB_URI=...         # Required: MongoDB connection string
JWT_SECRET=...          # JWT signing secret (defaults to insecure dev value)
COOKIE_SECURE=true      # Set to "true" in production
TEACHER_EMAIL=...       # Email address that gets teacher role automatically
```

## Architecture Overview

**Dev Dojo** is a gamified CSS/HTML/JS/React learning platform built with Next.js 15 (App Router), MongoDB/Mongoose, and Tailwind CSS v4.

### Route Groups

- `(app)/` — authenticated student area (dashboard, modules, playground, leaderboard, profile). Protected by `getSession()` redirect in the layout.
- `(auth)/` — login and registro pages (unauthenticated).
- `(teacher)/teacher/` — teacher-only panel for approving students and toggling module visibility.
- `api/` — REST API routes for auth, modules, progress, achievements, leaderboard, playgrounds.

### Auth Flow

Custom JWT auth (no NextAuth). `src/lib/auth.ts` issues/verifies JWTs stored in a `dev-dojo-token` HttpOnly cookie. `getSession()` is called server-side in layouts and API routes. The `ApprovalGate` component (`src/components/auth/ApprovalGate.tsx`) blocks unapproved students from accessing the app.

### Content Model

All course content lives as **static TypeScript files** in `src/data/modules/`. There are four tracks (dojos): `css`, `html`, `js`, `react`. Each file exports a `ModuleData` object containing `lessons` (markdown content + optional code examples) and `exercises`. Exercises have a `type` field — one of `quiz`, `code-completion`, `live-editor`, `visual-match`, `drag-drop` — and a `validation` object used by `ExerciseRenderer` to grade answers client-side.

Module visibility is controlled at runtime via the `ModuleSettings` MongoDB collection, which teachers can toggle via `/teacher/modulos`. The API endpoint `GET /api/modules/enabled` merges static module data with DB-stored enabled/disabled flags.

### Gamification

- XP is awarded per exercise completion (`xpReward` field on each exercise, scaled by score).
- Ranks (Aprendiz → Sensei) are defined in `src/lib/constants.ts` and computed by `src/lib/xp.ts`.
- Achievements are tracked in the `Achievement` MongoDB model and evaluated server-side in `src/lib/achievements.ts`.
- Progress records are stored per-user per-exercise in the `Progress` MongoDB model.

### Active Dojo Context

The currently selected dojo track (css/html/js/react) is managed via `DojoContext` (`src/hooks/useDojo.ts`) and the `DojoSwitcher` component in the sidebar. Module listings filter by the active dojo.

### Key Libraries

- `@monaco-editor/react` — code editor in exercises and playground
- `@dnd-kit/core` — drag-and-drop exercises
- `framer-motion` — UI animations
- `zod` — API request validation
