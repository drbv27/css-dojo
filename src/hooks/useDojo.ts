"use client";
import { createContext, useContext } from "react";

export type DojoType = "css" | "js";

export interface DojoContextType {
  activeDojo: DojoType;
  setActiveDojo: (dojo: DojoType) => void;
}

export const DojoContext = createContext<DojoContextType>({
  activeDojo: "css",
  setActiveDojo: () => {},
});

export function useDojo() {
  return useContext(DojoContext);
}
