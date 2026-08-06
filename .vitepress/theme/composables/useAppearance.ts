import { ref, computed, onMounted, onUnmounted } from "vue";

type Theme = "auto" | "light" | "dark";

const STORAGE_KEY = "vitepress-theme-appearance";
const DEFAULT_THEME: Theme = "auto";
const CYCLE_ORDER: Theme[] = [DEFAULT_THEME, "light", "dark"];

function isTheme(value: string | null): value is Theme {
  return CYCLE_ORDER.includes(value as Theme);
}

export function readStored(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme): void {
  const isDark = theme === "dark" || (theme === "auto" && prefersDark());
  document.documentElement.classList.toggle("dark", isDark);
}

export function useAppearance() {
  const theme = ref<Theme>(DEFAULT_THEME);
  let mediaQuery: MediaQueryList | null = null;

  function setTheme(value: Theme): void {
    theme.value = value;
    localStorage.setItem(STORAGE_KEY, value);
    applyTheme(value);
  }

  function cycleTheme(): void {
    const next =
      CYCLE_ORDER[(CYCLE_ORDER.indexOf(theme.value) + 1) % CYCLE_ORDER.length];
    setTheme(next);
  }

  function onSystemChange(): void {
    if (theme.value === "auto") {
      applyTheme("auto");
    }
  }

  const themeIcon = computed<"monitor" | "sun" | "moon">(() => {
    if (theme.value === "dark") return "moon";
    if (theme.value === "light") return "sun";
    return "monitor";
  });

  onMounted(() => {
    theme.value = readStored();
    applyTheme(theme.value);
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", onSystemChange);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener("change", onSystemChange);
  });

  return { theme, themeIcon, cycleTheme };
}
