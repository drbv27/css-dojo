// ==================== Enums & Literal Types ====================

export type ExerciseType =
  | "quiz"
  | "code-completion"
  | "live-editor"
  | "visual-match"
  | "drag-drop";

export type Difficulty = 1 | 2 | 3;

export type UserRole = "student" | "teacher";

export type DojoType = "css" | "js";

export type ModuleCategory = "intro" | "intermediate" | "advanced" | "preprocessors" | "frameworks" | "js-fundamentals" | "js-intermediate" | "js-advanced" | "js-projects";

export type ValidationType = "exact" | "regex" | "includes" | "visual";

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
  editable: boolean;
}

export interface Validation {
  type: ValidationType;
  answer: any;
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

export interface ModuleData {
  slug: string;
  title: string;
  description: string;
  order: number;
  dojo: DojoType;
  category: ModuleCategory;
  icon: string;
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
