import { create } from 'zustand';
import { useEffect, createContext, useContext } from 'react';
import type { Theme } from '@/shared/types';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  theme: (typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  setTheme: (theme) => set({ theme }),
}));

// Apply theme class to <html>
export function useTheme() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
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