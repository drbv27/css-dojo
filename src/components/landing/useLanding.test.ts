import { describe, expect, it } from "vitest";
import { useLanding } from "./useLanding";

// Requirement: Removal of Dead Loading State — `loaded`/`setLoaded` have zero
// callers (verified repo-wide) and must not exist in the store at all.
describe("useLanding", () => {
  it("does not declare the dead loaded field or setLoaded setter", () => {
    const state = useLanding.getState();
    expect(state).not.toHaveProperty("loaded");
    expect(state).not.toHaveProperty("setLoaded");
  });

  it("still exposes the live fields the landing depends on", () => {
    const state = useLanding.getState();
    expect(state).toHaveProperty("activeSection");
    expect(state).toHaveProperty("progress");
    expect(state).toHaveProperty("autoplay");
    expect(state).toHaveProperty("setActiveSection");
    expect(state).toHaveProperty("setProgress");
    expect(state).toHaveProperty("setAutoplay");
  });
});
