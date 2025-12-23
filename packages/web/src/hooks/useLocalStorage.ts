import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use effect to load from localStorage on client side only
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsLoaded(true);
  }, [key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isLoaded] as const;
}

// Hook for managing session data
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

// Hook for managing user preferences
export interface UserPreferences {
  compactMode: boolean;
  showAnimations: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
}

const defaultPreferences: UserPreferences = {
  compactMode: false,
  showAnimations: true,
  highContrast: false,
  fontSize: 'medium',
  reducedMotion: false,
};

export function useUserPreferences() {
  const [preferences, setPreferences, isLoaded] = useLocalStorage<UserPreferences>(
    'mindhack_preferences',
    defaultPreferences
  );

  const updatePreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [setPreferences]
  );

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences]);

  return { preferences, updatePreference, resetPreferences, isLoaded };
}

// Hook for managing user progress
export interface TrainingProgress {
  level: number;
  xp: number;
  challengesCompleted: number;
  totalHelpPoints: number;
  badges: string[];
  currentStreak: number;
  lastActiveDate: string | null;
}

const defaultProgress: TrainingProgress = {
  level: 1,
  xp: 0,
  challengesCompleted: 0,
  totalHelpPoints: 0,
  badges: [],
  currentStreak: 1,
  lastActiveDate: null,
};

export function useTrainingProgress() {
  const [progress, setProgress, isLoaded] = useLocalStorage<TrainingProgress>(
    'mindhack_training_progress',
    defaultProgress
  );

  // Update streak on load
  useEffect(() => {
    if (!isLoaded || !progress.lastActiveDate) return;

    const lastActive = new Date(progress.lastActiveDate);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Consecutive day
      setProgress((prev) => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
        lastActiveDate: today.toISOString(),
      }));
    } else if (diffDays > 1) {
      // Streak broken
      setProgress((prev) => ({
        ...prev,
        currentStreak: 1,
        lastActiveDate: today.toISOString(),
      }));
    }
  }, [isLoaded]);

  const addXP = useCallback(
    (amount: number) => {
      setProgress((prev) => {
        const newXP = prev.xp + amount;
        // Calculate new level (simple formula: level = floor(sqrt(xp / 50)) + 1)
        const newLevel = Math.floor(Math.sqrt(newXP / 50)) + 1;

        return {
          ...prev,
          xp: newXP,
          level: Math.max(prev.level, newLevel),
          challengesCompleted: prev.challengesCompleted + 1,
          totalHelpPoints: prev.totalHelpPoints + amount,
          lastActiveDate: new Date().toISOString(),
        };
      });
    },
    [setProgress]
  );

  const addBadge = useCallback(
    (badge: string) => {
      setProgress((prev) => {
        if (prev.badges.includes(badge)) return prev;
        return {
          ...prev,
          badges: [...prev.badges, badge],
          lastActiveDate: new Date().toISOString(),
        };
      });
    },
    [setProgress]
  );

  const resetProgress = useCallback(() => {
    setProgress({
      ...defaultProgress,
      lastActiveDate: new Date().toISOString(),
    });
  }, [setProgress]);

  return { progress, setProgress, addXP, addBadge, resetProgress, isLoaded };
}

// Hook for managing quick notes (for journaling)
export interface QuickNote {
  id: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible' | null;
  createdAt: string;
  tags: string[];
}

export function useQuickNotes() {
  const [notes, setNotes, isLoaded] = useLocalStorage<QuickNote[]>(
    'mindhack_quick_notes',
    []
  );

  const addNote = useCallback(
    (content: string, mood: QuickNote['mood'] = null, tags: string[] = []) => {
      const newNote: QuickNote = {
        id: crypto.randomUUID?.() || Date.now().toString(),
        content,
        mood,
        createdAt: new Date().toISOString(),
        tags,
      };
      setNotes((prev) => [newNote, ...prev].slice(0, 100)); // Keep last 100 notes
      return newNote;
    },
    [setNotes]
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [setNotes]
  );

  const clearNotes = useCallback(() => {
    setNotes([]);
  }, [setNotes]);

  return { notes, addNote, deleteNote, clearNotes, isLoaded };
}

// Hook for managing favorite resources
export function useFavoriteResources() {
  const [favorites, setFavorites, isLoaded] = useLocalStorage<string[]>(
    'mindhack_favorites',
    []
  );

  const toggleFavorite = useCallback(
    (resourceId: string) => {
      setFavorites((prev) =>
        prev.includes(resourceId)
          ? prev.filter((id) => id !== resourceId)
          : [...prev, resourceId]
      );
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (resourceId: string) => favorites.includes(resourceId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
