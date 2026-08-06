import { describe, it, expect, beforeEach } from "vitest";

import { readStored } from "../../theme/composables/useAppearance";

const STORAGE_KEY = "vitepress-theme-appearance";

describe("useAppearance", () => {
  describe("readStored", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("returns a valid stored theme unchanged", () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      expect(readStored()).toBe("dark");
    });

    it("returns 'light' when a valid 'light' value is stored", () => {
      localStorage.setItem(STORAGE_KEY, "light");
      expect(readStored()).toBe("light");
    });

    it("falls back to the default theme when no value is stored", () => {
      expect(readStored()).toBe("auto");
    });

    it("falls back to the default theme when the stored value is corrupt", () => {
      localStorage.setItem(STORAGE_KEY, "not-a-theme");
      expect(readStored()).toBe("auto");
    });

    it("falls back to the default theme when the stored value is empty", () => {
      localStorage.setItem(STORAGE_KEY, "");
      expect(readStored()).toBe("auto");
    });
  });
});
