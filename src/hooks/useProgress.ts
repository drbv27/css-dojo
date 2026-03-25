"use client";

import { useCallback, useEffect, useState } from "react";

interface ProgressEntry {
  moduleId: string;
  exerciseId: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  attempts: number;
}

interface ModuleProgress {
  completed: number;
  total: number;
  percentage: number;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchProgress() {
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setProgress(data);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProgress();
    return () => {
      cancelled = true;
    };
  }, []);

  const getModuleProgress = useCallback(
    (moduleId: string, totalExercises: number): ModuleProgress => {
      const moduleEntries = progress.filter(
        (p) => p.moduleId === moduleId && p.completed
      );
      const completed = moduleEntries.length;
      const total = totalExercises;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    },
    [progress]
  );

  return { progress, loading, getModuleProgress };
}
