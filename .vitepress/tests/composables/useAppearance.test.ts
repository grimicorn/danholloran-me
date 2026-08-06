import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { defineComponent } from "vue";
import { mount, flushPromises } from "@vue/test-utils";

import {
  readStored,
  useAppearance,
} from "../../theme/composables/useAppearance";

const STORAGE_KEY = "vitepress-theme-appearance";

function mockPrefersDark(prefersDark: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: prefersDark,
    media: "(prefers-color-scheme: dark)",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList);
}

function mountAppearance() {
  const Harness = defineComponent({
    setup() {
      useAppearance();
      return () => null;
    },
  });
  return mount(Harness, { attachTo: document.body });
}

describe("useAppearance", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("readStored", () => {
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

    it("falls back to the default theme when localStorage access throws", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });
      expect(readStored()).toBe("auto");
    });
  });

  describe("applied theme on mount", () => {
    it("resolves a corrupt stored value to the default (auto) rather than propagating it", async () => {
      localStorage.setItem(STORAGE_KEY, "not-a-theme");
      mockPrefersDark(true);
      mountAppearance();
      await flushPromises();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("applies the stored dark theme on mount", async () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      mockPrefersDark(false);
      mountAppearance();
      await flushPromises();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
