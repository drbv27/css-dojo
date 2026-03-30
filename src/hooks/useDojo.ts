"use client";

import { createContext, useContext } from "react";
import type { DojoType } from "@/types";

export interface DojoContextValue {
  activeDojo: DojoType;
  setActiveDojo: (dojo: DojoType) => void;
}

export const DojoContext = createContext<DojoContextValue>({
  activeDojo: "css",
  setActiveDojo: () => {},
});

export function useDojo() {
  return useContext(DojoContext);
}
