import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance,
} from "vitest";
import { createApp, defineComponent, type App } from "vue";
import { useAppearance } from "../../theme/composables/useAppearance";

const STORAGE_KEY = "vitepress-theme-appearance";
const DARK_CLASS = "dark";

type ChangeListener = () => void;

type ControllableMediaQuery = {
  mediaQuery: MediaQueryList;
  matchMediaSpy: MockInstance;
  emitSystemChange: (_matches: boolean) => void;
  listenerCount: () => number;
};

// A matchMedia stand-in whose `matches` and `change` listeners we drive by hand,
// so system-theme behavior is deterministic instead of tied to the real host.
function createControllableMediaQuery(initialMatches: boolean): {
  mediaQuery: MediaQueryList;
  emitSystemChange: (_matches: boolean) => void;
  listenerCount: () => number;
} {
  const listeners: ChangeListener[] = [];
  const mediaQuery = {
    matches: initialMatches,
    addEventListener: vi.fn((_event: string, listener: ChangeListener) => {
      listeners.push(listener);
    }),
    removeEventListener: vi.fn((_event: string, listener: ChangeListener) => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }),
  } as unknown as MediaQueryList;

  function emitSystemChange(matches: boolean): void {
    (mediaQuery as unknown as { matches: boolean }).matches = matches;
    listeners.slice().forEach((listener) => listener());
  }

  return {
    mediaQuery,
    emitSystemChange,
    listenerCount: () => listeners.length,
  };
}

// Every app mounted through withSetup is torn down in afterEach so no test leaks
// a live component holding a system-theme change listener into the next one.
const mountedApps: App[] = [];

function withSetup<T>(composable: () => T): { result: T; app: App } {
  let result!: T;
  const app = createApp(
    defineComponent({
      setup() {
        result = composable();
        return () => null;
      },
    }),
  );
  app.mount(document.createElement("div"));
  mountedApps.push(app);
  return { result, app };
}

function unmount(app: App): void {
  app.unmount();
  const index = mountedApps.indexOf(app);
  if (index !== -1) {
    mountedApps.splice(index, 1);
  }
}

function stubSystemDark(prefersDark: boolean): ControllableMediaQuery {
  const controllable = createControllableMediaQuery(prefersDark);
  const matchMediaSpy = vi
    .spyOn(window, "matchMedia")
    .mockReturnValue(controllable.mediaQuery);
  return { ...controllable, matchMediaSpy };
}

function isDocumentDark(): boolean {
  return document.documentElement.classList.contains(DARK_CLASS);
}

describe("useAppearance", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(DARK_CLASS);
  });

  afterEach(() => {
    mountedApps.splice(0).forEach((app) => app.unmount());
    vi.restoreAllMocks();
  });

  describe("localStorage persistence", () => {
    it("reads the stored theme on mount", () => {
      stubSystemDark(false);
      localStorage.setItem(STORAGE_KEY, "dark");

      const { result } = withSetup(useAppearance);

      expect(result.theme.value).toBe("dark");
      expect(isDocumentDark()).toBe(true);
    });

    it("defaults to auto by reading storage, without persisting a default", () => {
      stubSystemDark(false);
      const getItemSpy = vi.spyOn(localStorage, "getItem");

      const { result } = withSetup(useAppearance);

      expect(getItemSpy).toHaveBeenCalledWith(STORAGE_KEY);
      expect(result.theme.value).toBe("auto");
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("persists every theme to localStorage as it is cycled", () => {
      stubSystemDark(false);

      const { result } = withSetup(useAppearance);

      result.cycleTheme();
      expect(localStorage.getItem(STORAGE_KEY)).toBe("light");

      result.cycleTheme();
      expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");

      result.cycleTheme();
      expect(localStorage.getItem(STORAGE_KEY)).toBe("auto");
    });
  });

  describe("matchMedia system-theme listener", () => {
    it("registers a change listener on mount", () => {
      const controllable = stubSystemDark(false);

      withSetup(useAppearance);

      expect(controllable.mediaQuery.addEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
      expect(controllable.listenerCount()).toBe(1);
    });

    it("re-applies dark when the system flips to dark while on auto", () => {
      const controllable = stubSystemDark(false);

      withSetup(useAppearance);
      expect(isDocumentDark()).toBe(false);

      controllable.emitSystemChange(true);
      expect(isDocumentDark()).toBe(true);
    });

    it("drops dark when the system flips to light while on auto", () => {
      const controllable = stubSystemDark(true);

      withSetup(useAppearance);
      expect(isDocumentDark()).toBe(true);

      controllable.emitSystemChange(false);
      expect(isDocumentDark()).toBe(false);
    });

    it("ignores system changes when the theme is not auto", () => {
      const controllable = stubSystemDark(false);

      const { result } = withSetup(useAppearance);
      result.cycleTheme(); // auto -> light, dark class removed
      expect(isDocumentDark()).toBe(false);

      controllable.emitSystemChange(true);
      expect(isDocumentDark()).toBe(false);
    });

    it("removes the change listener on unmount", () => {
      const controllable = stubSystemDark(false);

      const { app } = withSetup(useAppearance);
      unmount(app);

      expect(controllable.mediaQuery.removeEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
      expect(controllable.listenerCount()).toBe(0);
    });
  });

  describe("auto/light/dark cycle", () => {
    it("cycles auto -> light -> dark -> auto", () => {
      stubSystemDark(false);

      const { result } = withSetup(useAppearance);
      expect(result.theme.value).toBe("auto");

      result.cycleTheme();
      expect(result.theme.value).toBe("light");

      result.cycleTheme();
      expect(result.theme.value).toBe("dark");

      result.cycleTheme();
      expect(result.theme.value).toBe("auto");
    });

    it("maps each theme to its icon", () => {
      stubSystemDark(false);

      const { result } = withSetup(useAppearance);
      expect(result.themeIcon.value).toBe("monitor");

      result.cycleTheme();
      expect(result.themeIcon.value).toBe("sun");

      result.cycleTheme();
      expect(result.themeIcon.value).toBe("moon");
    });

    it("applies the dark class for an explicit dark theme", () => {
      stubSystemDark(false);

      const { result } = withSetup(useAppearance);
      result.cycleTheme(); // light
      result.cycleTheme(); // dark

      expect(isDocumentDark()).toBe(true);
    });

    it("re-consults the system preference when cycling back to auto", () => {
      stubSystemDark(true);

      const { result } = withSetup(useAppearance);
      result.cycleTheme(); // light
      expect(isDocumentDark()).toBe(false);

      result.cycleTheme(); // dark
      expect(isDocumentDark()).toBe(true);

      result.cycleTheme(); // auto, system prefers dark
      expect(result.theme.value).toBe("auto");
      expect(isDocumentDark()).toBe(true);
    });

    it("drops the dark class for an explicit light theme even when the system prefers dark", () => {
      stubSystemDark(true);

      const { result } = withSetup(useAppearance);
      expect(isDocumentDark()).toBe(true); // auto + system dark

      result.cycleTheme(); // light
      expect(isDocumentDark()).toBe(false);
    });

    it("follows the system preference while on auto", () => {
      const { matchMediaSpy } = stubSystemDark(true);

      withSetup(useAppearance);

      expect(isDocumentDark()).toBe(true);
      expect(matchMediaSpy).toHaveBeenCalledWith(
        "(prefers-color-scheme: dark)",
      );
    });
  });
});
