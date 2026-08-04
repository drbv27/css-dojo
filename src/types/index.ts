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
  | "intro"
  | "intermediate"
  | "advanced"
  | "preprocessors"
  | "frameworks"
  // Cierre de un track. Se renderiza DESPUES de frameworks, porque un proyecto
  // integrador usa todo lo anterior.
  | "project"
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
}

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
  hint?: string;
  explanation?: string;
}

// ==================== Module ====================

export type DojoType = "html" | "css" | "js" | "react" | "react-eco" | "nextjs";

export interface ModuleData {
  slug: string;
  title: string;
  description: string;
  order: number;
  category: ModuleCategory;
  icon: string;
  dojo: DojoType;
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
