import { create } from 'zustand';
import { useEffect, createContext, useContext } from 'react';
import type { Theme } from '@/shared/types';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const useThemeStore = create<ThemeStore>((set) => {
  const getStoredTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem('imagecraft-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  return {
    theme: getStoredTheme(),
    toggleTheme: () =>
      set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('imagecraft-theme', nextTheme);
        }
        return { theme: nextTheme };
      }),
    setTheme: (theme) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('imagecraft-theme', theme);
      }
      set({ theme });
    },
  };
});

// Apply theme class to <html>
export function useTheme() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

  return { theme, toggleTheme };
}

// Provider for components that need to consume theme context (optional)
const ThemeContext = createContext<Theme>('light');
export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  useTheme(); // side effect to set class
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}