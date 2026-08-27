// ==================== Enums & Literal Types ====================

export type ExerciseType =
  | "quiz"
  | "code-completion"
  | "live-editor"
  | "visual-match"
  | "drag-drop";

export type Difficulty = 1 | 2 | 3;

export type UserRole = "student" | "teacher";

export type ModuleCategory =
  | "html-fundamentals"
  | "html-intermediate"
  | "html-advanced"
  // Closes the HTML track, after html-advanced. Mirrors "css-proyecto",
  // "react-projects" and "js-projects": a capstone renders last, never mid-list.
  | "html-projects"
  // CSS track sections. They replaced six generic categories (intro,
  // intermediate, advanced, preprocessors, frameworks, project) that were used
  // by the CSS track alone and told a student nothing about what a section
  // taught -- three of them even rendered the same colour.
  | "css-fundamentos"
  | "css-caja"
  | "css-texto"
  | "css-selectores"
  | "css-layout"
  | "css-visual"
  | "css-responsive"
  | "css-herramientas"
  // Closes the CSS track, after css-herramientas. A capstone integrates
  // everything before it, so it renders last, never mid-list.
  | "css-proyecto"
  | "js-fundamentals"
  | "js-intermediate"
  | "js-advanced"
  | "js-async"
  | "js-dom"
  | "js-projects"
  | "js-typescript"
  | "react-fundamentals"
  | "react-intermediate"
  | "react-advanced"
  | "react-projects"
  | "react-eco-routing"
  | "react-eco-state"
  | "react-eco-ui"
  | "react-eco-forms"
  | "react-eco-data"
  | "nextjs-fundamentals"
  | "nextjs-intermediate"
  | "nextjs-advanced";

export type ValidationType =
  | "exact"
  | "regex"
  | "includes"
  | "includes-ordered"
  // Parses the submitted CSS into selector -> declarations and checks that each
  // expected rule is present. Unlike "includes", it cannot be satisfied by
  // typing the expected words as prose, and it verifies that a declaration sits
  // under the RIGHT selector. Prefer it for any CSS exercise.
  | "css-rules"
  // Parses the submitted HTML into a real DOM and checks each expectation with a
  // CSS selector, so NESTING and attributes are verified rather than the mere
  // presence of tag fragments somewhere in the text. Prefer it for any HTML
  // exercise. See src/lib/htmlStructure.ts for the expectation syntax.
  | "html-structure"
  // Runs the submitted JavaScript in the preview sandbox and checks what it
  // DOES, one declared case at a time. Grades correctness rather than shape, so
  // unlike a syntax check it cannot be satisfied by code that merely looks
  // right. See src/lib/jsBehavior.ts.
  | "js-behavior"
  | "visual";

// ==================== Core Data Structures ====================

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface DragItem {
  id: string;
  content: string;
  correctZone: string;
}

export interface DropZone {
  id: string;
  label: string;
}

export interface CodeTemplate {
  html: string;
  cssPrefix: string;
  cssSuffix: string;
  blanks?: string[];
}

export interface CodeExample {
  html: string;
  css: string;
  js?: string;
  editable: boolean;
}

export interface Validation {
  type: ValidationType;
  /**
   * Optional for "css-rules", which grades against the exercise's own
   * `targetCSS` so the correct answer lives in exactly one place and cannot
   * drift. Required for every other type.
   */
  answer?: any;
  /**
   * Required for "js-behavior" and used by nothing else. See `cases` below and
   * src/lib/jsBehavior.ts.
   */
  cases?: JsBehaviorCase[];
}

// ==================== JavaScript behavioral grading ====================

/**
 * One observable expectation about the student's code. Graded by RUNNING the
 * submission and evaluating `call`, never by inspecting how it was written.
 *
 * Deliberately serializable: these ship inside the static module data, so they
 * have to survive being read, diffed and reviewed as plain text.
 */
export interface JsBehaviorCase {
  /** Expression evaluated after the submission runs, e.g. `"sumar(1, 2)"`. */
  call: string;
  /** Expected value. MUST be JSON-serializable. */
  expect: unknown;
  /** Shown to the student instead of the raw expression when present. */
  label?: string;
}

/** Outcome of a single case. */
export type JsCaseOutcome =
  | { kind: "pass" }
  | { kind: "fail"; observed: unknown }
  | { kind: "runtime-error"; message: string }
  | { kind: "not-defined"; identifier: string }
  | { kind: "unserializable" };

/**
 * Outcome of a whole run. A union rather than a struct with optional fields, so
 * that "a syntax error that somehow also carries per-case results" is not
 * representable at all.
 */
export type JsRunOutcome =
  | { kind: "ok"; cases: JsCaseOutcome[] }
  | { kind: "syntax-error"; message: string }
  | { kind: "timeout" };

// ==================== Lesson & Exercise ====================

export interface Lesson {
  id: string;
  title: string;
  content: string; // markdown
  codeExample?: CodeExample;
  order: number;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: Difficulty;
  xpReward: number;
  order: number;
  prompt: string;
  options?: QuizOption[];
  codeTemplate?: CodeTemplate;
  targetCSS?: string;
  dragItems?: DragItem[];
  dropZones?: DropZone[];
  validation: Validation;
  /**
   * A submission proven to score 100 against this exercise's own cases.
   * REQUIRED for "js-behavior" and asserted by a data guard: without it an
   * over-strict case ships an unpassable exercise and it reads as the student's
   * mistake. Same reason validacion-html.test.ts carries one for all 20 HTML
   * exercises.
   */
  referenceSolution?: string;
  hint?: string;
  explanation?: string;
  /**
   * Id of the lesson this exercise is a challenge FOR, within the same module.
   *
   * OPTIONAL AND BACKWARD-COMPATIBLE. Without it a module renders exactly as it
   * always has: every lesson in one list, every exercise in another. With it,
   * the lesson list interleaves — lesson, its challenges, next lesson — which
   * is the whole point: practising a concept while it is still warm instead of
   * meeting eight exercises at the end.
   *
   * The exercise list keeps showing EVERY exercise regardless, so anchoring one
   * never hides it.
   *
   * A value that names no lesson of this module is a DANGLING anchor. It is
   * caught by a curriculum guard, and at runtime the exercise falls back to
   * un-anchored rather than disappearing — see `@/lib/intercalado`.
   */
  afterLesson?: string;
}

// ==================== Module ====================

export type DojoType = "html" | "css" | "js" | "react" | "react-eco" | "nextjs";

/**
 * Curriculum level of a module, used by the certificate feature.
 *
 * "obligatorio" modules form the minimum path of a track; "profundizacion"
 * modules are never demanded for a certificate.
 */
export type ModuleNivel = "obligatorio" | "profundizacion";

export interface ModuleData {
  slug: string;
  title: string;
  description: string;
  order: number;
  category: ModuleCategory;
  icon: string;
  dojo: DojoType;
  /**
   * OPTIONAL ON PURPOSE, and its absence means "not classified" — NEVER
   * "obligatorio". A silent default would let an unclassified module become
   * part of a credential's minimum path without anyone deciding it.
   *
   * The safety comes from the gate in `@/lib/certificados`: a track certifies
   * only when EVERY one of its modules declares this field. Today only `css`
   * does; the other five tracks correctly refuse to certify.
   */
  nivel?: ModuleNivel;
  lessons: Lesson[];
  exercises: Exercise[];
}

// ==================== Gamification ====================

export interface Rank {
  name: string;
  minXP: number;
  icon: string;
  color: string;
}

export interface Achievement {
  slug: string;
  title: string;
  description: string;
  icon: string;
  condition: {
    type: string;
    value: number;
    moduleId?: string;
  };
}

export interface XPProgress {
  current: number;
  needed: number;
  percentage: number;
}

// ==================== User & Progress ====================

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressData {
  id: string;
  userId: string;
  moduleId: string;
  exerciseId: string;
  exerciseType: ExerciseType;
  completed: boolean;
  score: number;
  xpEarned: number;
  attempts: number;
  lastAttemptAt?: Date;
  userAnswer?: any;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaygroundData {
  id: string;
  userId: string;
  title: string;
  html: string;
  css: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Navigation ====================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
