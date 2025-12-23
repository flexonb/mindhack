'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mindhack_theme') as Theme | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      setThemeState(savedTheme);
    }
    setMounted(true);
  }, []);

  // Update resolved theme and HTML class
  useEffect(() => {
    if (!mounted) return;

    const updateTheme = () => {
      let resolved: 'light' | 'dark';

      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }

      setResolvedTheme(resolved);

      // Apply dark class to html element
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('mindhack_theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('mindhack_theme', newTheme);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // Return default values if context is undefined
  if (context === undefined) {
    return {
      theme: 'light' as Theme,
      resolvedTheme: 'light' as 'light' | 'dark',
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}

// Hook for getting current theme colors for styling
export function useThemeColors() {
  const { resolvedTheme } = useTheme();

  return {
    isDark: resolvedTheme === 'dark',
    colors: resolvedTheme === 'dark' ? darkColors : lightColors,
  };
}

const lightColors = {
  bg: 'bg-white',
  bgSecondary: 'bg-calm-50',
  bgTertiary: 'bg-calm-100',
  text: 'text-calm-900',
  textSecondary: 'text-calm-600',
  textMuted: 'text-calm-400',
  border: 'border-calm-200',
  borderLight: 'border-calm-100',
  accent: 'bg-primary-600',
  accentHover: 'hover:bg-primary-700',
};

const darkColors = {
  bg: 'bg-calm-950',
  bgSecondary: 'bg-calm-900',
  bgTertiary: 'bg-calm-800',
  text: 'text-calm-50',
  textSecondary: 'text-calm-300',
  textMuted: 'text-calm-500',
  border: 'border-calm-700',
  borderLight: 'border-calm-800',
  accent: 'bg-primary-500',
  accentHover: 'hover:bg-primary-400',
};
