# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev       # Start Next.js dev server

# Build & lint
npm run build
npm run lint

# Tests
npm test          # Vitest in watch mode
npm run test:run  # Vitest once (use this in CI or before a commit)
npm run test:e2e  # Playwright end-to-end
```

There IS a test suite: 41 Vitest files (`src/**/*.test.ts[x]`) plus 3 Playwright specs
in `e2e/`. Measured 2026-09-01; this number goes stale every time
content lands, so re-measure before quoting it. Two kinds worth knowing about, because they guard different things:

- **Unit tests** over the graders and helpers -- `src/lib/cssRules.test.ts`,
  `htmlStructure`, `jsBehavior`, `xp`, `shuffle`.
- **Curriculum tests** that read the static content in `src/data/modules/` and
  assert things the content itself can get wrong. Four to know before writing
  curriculum:
  - `acentuacion.test.ts` **requires** correct Spanish accents: it fails on a
    word missing its tilde or `ñ`. It is not a ban on accents.
  - `validacion-curriculum.test.ts` **forbids** `validation.type: "includes"`
    for CSS exercises — grade them with `css-rules`, `html-structure`, quiz or
    drag-drop, never substring search (`row` matched inside `arrow`).
  - `orden-curriculum-css.test.ts` guards the CSS teaching order AND pins both
    the module count and the category list, so adding or regrouping CSS modules
    fails it by design.
  - `nivel-curriculum.test.ts` pins the `nivel` classification of the CSS track
    **by slug**, and carries a **tripwire**: it fails the moment any module
    outside `css` declares a `nivel`. That is deliberate — classifying a second
    track changes what a certificate means, so it has to be a decision, not a
    side effect. It also fails if a seventh dojo appears.
  `src/lib/shuffle.test.ts` also runs over the real curriculum to check that no
  answer position ends up concentrating the correct answers.

## Environment Variables

Create a `.env.local` file in the project root with:

```
MONGODB_URI=...         # Required: MongoDB connection string
JWT_SECRET=...          # JWT signing secret (defaults to insecure dev value)
COOKIE_SECURE=true      # Set to "true" in production
TEACHER_EMAIL=...       # Email address that gets teacher role automatically
```

## Architecture Overview

**Dev Dojo** is a gamified web-development learning platform built with Next.js 16 (App Router), MongoDB/Mongoose, and Tailwind CSS v4.

### Route Groups

- `(app)/` — authenticated student area (dashboard, modules, playground, leaderboard, profile). Protected by `getSession()` redirect in the layout.
- `(auth)/` — login and registro pages (unauthenticated).
- `(teacher)/teacher/` — teacher-only panel for approving students and toggling module visibility.
- `api/` — REST API routes for auth, modules, progress, achievements, leaderboard, playgrounds.

### Auth Flow

Custom JWT auth (no NextAuth). `src/lib/auth.ts` issues/verifies JWTs stored in a `dev-dojo-token` HttpOnly cookie. `getSession()` is called server-side in layouts and API routes. The `ApprovalGate` component (`src/components/auth/ApprovalGate.tsx`) blocks unapproved students from accessing the app.

### Content Model

All course content lives as **static TypeScript files** in `src/data/modules/`. There are **six** tracks (dojos) and **112** modules, measured 2026-09-01 against `ALL_MODULES`:

| dojo | modules |
|---|---|
| `css` | 36 |
| `js` | 29 (25 `js-*` + 4 `ts-*`) |
| `react` | 20 |
| `html` | 17 |
| `react-eco` | 5 |
| `nextjs` | 5 |

This section used to say "four tracks: css, html, js, react". It was wrong, and
the omission of `react-eco` ("Ecosistema React") already caused a feature to be
designed against five tracks. **Write rules over `DojoType` or over every module
of a track — never over a hardcoded list of tracks.**

Each file exports a `ModuleData` object containing `lessons` (markdown content + optional code examples) and `exercises`. Exercises have a `type` field — one of `quiz`, `code-completion`, `live-editor`, `visual-match`, `drag-drop` — and a `validation` object used by `ExerciseRenderer` to grade answers client-side.

Modules are grouped into **sections** (`category`), listed per dojo in
`DOJO_CATEGORY_ORDER`. Two invariants, each with its own guard:
`categorias-panel.test.ts` checks module -> section (no module has an
unreachable category), and `secciones-sin-modulos.test.ts` checks the reverse,
section -> module: **no declared section may hold zero modules.** The CSS track
stays at **nine** sections — `css-oficio` is never created, see Requirement 7 of
`openspec/specs/css-track-sections`. `js-async` and `js-dom` are declared and
empty today; they are named exemptions in that guard, and the guard fails if
either gets a module or stops being declared.

Module visibility is controlled at runtime via the `ModuleSettings` MongoDB collection, which teachers can toggle via `/teacher/modulos`. The API endpoint `GET /api/modules/enabled` merges static module data with DB-stored enabled/disabled flags.

### Gamification

- XP is awarded per exercise completion (`xpReward` field on each exercise, scaled by score).
- Ranks (Aprendiz → Sensei) are defined in `src/lib/constants.ts` and computed by `src/lib/xp.ts`.
- Achievements are tracked in the `Achievement` MongoDB model and evaluated server-side in `src/lib/achievements.ts`.
- Progress records are stored per-user per-exercise in the `Progress` MongoDB model.

### Certificates (COMPLETE and deployed — do not rebuild it)

`src/lib/certificados.ts` implements completion certificates **per track**, and
the feature is **finished, merged and in production**. This section used to say
it was "wired to nothing: no API route, no UI"; that was true until 2026-08-27
and is now **inverted**, which is the worst kind of stale doc — a session that
believes it will rebuild what already exists. What exists:

- `POST /api/teacher/certificados` — awarding, teacher-only, with confirmation.
- `GET /api/certificados` — the student's own; the handler takes **no request**,
  so the `userId` comes from the session and no parameter can name someone else.
- `/teacher/certificados` — the teacher view. Reads in **batch** (4 queries, not
  one per student) and calls the SAME `elegibilidadDe` the awarding does.
- `/certificados` — the student view.

The only thing left is for the instructor to award the first one, which is not
code. Three rules to know before touching it:

1. **`nivel` on `ModuleData` is optional, and its absence means "not classified"
   — never `"obligatorio"`.** What makes that safe is the gate: a track
   certifies only when EVERY one of its modules declares a level. Today only
   `css` does; the other five correctly refuse.
2. **Eligibility demands EVERY required module of the track.** Not the ones a
   cohort currently has enabled — that rule existed briefly and certified people
   mid-course. The enabled set is read only to report *why* a module is missing
   (`aunNoHabilitados`).
3. **An awarded certificate is a frozen snapshot** (`Certificate` model). It
   records the modules it demanded and their exercise counts. Recomputation is
   for *eligibility*, never for *validity* — adding exercises to a required
   module (which happens; the CSS required path went 166 → 168 in one content
   commit) must not invalidate what someone already earned.

### Active Dojo Context

The currently selected dojo track (one of the six `DojoType` values) is managed via `DojoContext` (`src/hooks/useDojo.ts`) and the `DojoSwitcher` component in the sidebar. Module listings filter by the active dojo.

### Key Libraries

- `@monaco-editor/react` — code editor in exercises and playground
- `@dnd-kit/core` — drag-and-drop exercises
- `framer-motion` — UI animations
- `zod` — API request validation
