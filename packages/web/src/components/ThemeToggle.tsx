'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  variant?: 'icon' | 'dropdown' | 'segmented';
  className?: string;
}

export default function ThemeToggle({
  showLabel = false,
  variant = 'icon',
  className = ''
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  if (variant === 'segmented') {
    return (
      <div className={`flex items-center bg-calm-100 dark:bg-calm-800 rounded-lg p-1 ${className}`}>
        <button
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            theme === 'light'
              ? 'bg-white dark:bg-calm-700 text-calm-900 dark:text-white shadow-sm'
              : 'text-calm-600 dark:text-calm-400 hover:text-calm-900 dark:hover:text-white'
          }`}
        >
          <Sun className="h-4 w-4" />
          {showLabel && 'Light'}
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            theme === 'system'
              ? 'bg-white dark:bg-calm-700 text-calm-900 dark:text-white shadow-sm'
              : 'text-calm-600 dark:text-calm-400 hover:text-calm-900 dark:hover:text-white'
          }`}
        >
          <Monitor className="h-4 w-4" />
          {showLabel && 'System'}
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            theme === 'dark'
              ? 'bg-white dark:bg-calm-700 text-calm-900 dark:text-white shadow-sm'
              : 'text-calm-600 dark:text-calm-400 hover:text-calm-900 dark:hover:text-white'
          }`}
        >
          <Moon className="h-4 w-4" />
          {showLabel && 'Dark'}
        </button>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-calm-100 dark:bg-calm-800 rounded-lg text-calm-700 dark:text-calm-300 hover:bg-calm-200 dark:hover:bg-calm-700 transition-colors"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="text-sm font-medium capitalize">{resolvedTheme}</span>
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-calm-800 rounded-xl shadow-lg border border-calm-200 dark:border-calm-700 py-2 z-50 overflow-hidden">
              <button
                onClick={() => {
                  setTheme('light');
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                  theme === 'light'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-calm-700 dark:text-calm-300 hover:bg-calm-50 dark:hover:bg-calm-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </span>
                {theme === 'light' && <Check className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-calm-700 dark:text-calm-300 hover:bg-calm-50 dark:hover:bg-calm-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </span>
                {theme === 'dark' && <Check className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                  theme === 'system'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-calm-700 dark:text-calm-300 hover:bg-calm-50 dark:hover:bg-calm-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  System
                </span>
                {theme === 'system' && <Check className="h-4 w-4" />}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Icon only variant
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`p-2 rounded-lg text-calm-600 dark:text-calm-400 hover:bg-calm-100 dark:hover:bg-calm-800 transition-all ${className}`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
