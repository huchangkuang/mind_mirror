"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemeMode } from "@/lib/theme/constants";
import {
  applyThemeClass,
  getSystemMode,
  persistUserThemeChoice,
  readValidOverride,
  resolveEffectiveMode,
} from "@/lib/theme/theme-storage";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readEffectiveFromBrowser(): ThemeMode {
  const system = getSystemMode();
  const override = readValidOverride();
  return resolveEffectiveMode(override, system);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useLayoutEffect(() => {
    setModeState(readEffectiveFromBrowser());
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    const system = getSystemMode();
    persistUserThemeChoice(next, system);
    applyThemeClass(next);
    setModeState(next);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readValidOverride()) return;
      const system = getSystemMode();
      applyThemeClass(system);
      setModeState(system);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
