import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Debounced localStorage hook - reduces write operations
export function useDebouncedLocalStorage<T>(key: string, initialValue: T, delay: number = 500) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
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

  // Debounced setValue
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce the localStorage write
      timeoutRef.current = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }, delay);
    },
    [key, storedValue, delay]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [storedValue, setValue, isLoaded] as const;
}

// Cached API hook with stale-while-revalidate pattern
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useCachedApi<T>(
  fetchFn: () => Promise<T>,
  key: string,
  options: { cacheDuration?: number; skip?: boolean } = {}
) {
  const { cacheDuration = CACHE_DURATION, skip = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = apiCache.get(key) as CacheEntry<T> | undefined;
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    // Skip if requested
    if (skip) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await fetchFn();

      // Update cache
      apiCache.set(key, { data: result, timestamp: Date.now() });

      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [fetchFn, key, cacheDuration, skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    apiCache.delete(key);
    fetchData();
  }, [key, fetchData]);

  return { data, loading, error, refresh };
}

// Memoized selector hook
export function useMemoizedSelector<T, R>(
  value: T,
  selector: (value: T) => R,
  equalityFn: (a: R, b: R) => boolean = (a, b) => a === b
): R {
  const selected = useRef<R | null>(null);
  const [result, setResult] = useState<R>(() => selector(value));

  useEffect(() => {
    const newResult = selector(value);
    if (!equalityFn(selected.current!, newResult)) {
      selected.current = newResult;
      setResult(newResult);
    }
  }, [value, selector, equalityFn]);

  return result;
}

// Throttled callback hook
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 100
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args) => {
      const now = Date.now();
      const remaining = delay - (now - lastCallRef.current);

      if (remaining <= 0) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, remaining);
      }
    }) as T,
    [callback, delay]
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      const intersecting = entry.isIntersecting;
      setIsIntersecting(intersecting);
      if (intersecting) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { elementRef, isIntersecting, hasIntersected };
}

// Performance metrics hook
export function usePerformanceMetrics() {
  const metrics = useRef({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get Navigation Timing API metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.current.fcp = navigation.domContentLoadedEventEnd - navigation.startTime;
    }

    // Listen for Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      metrics.current.lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Listen for First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        const firstInput = entries[0] as PerformanceEventTiming;
        metrics.current.fid = firstInput.processingStart - firstInput.startTime;
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Listen for Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      metrics.current.cls = clsValue;
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return metrics.current;
}

// Batch state updates
export function useBatchedState<T>(initialValue: T) {
  const [state, setState] = useState(initialValue);
  const pendingUpdates = useRef<Partial<T> | ((prev: T) => Partial<T>) | null>(null);
  const frameRequestRef = useRef<number | null>(null);

  const batchedSetState = useCallback((updates: Partial<T> | ((prev: T) => Partial<T>)) => {
    pendingUpdates.current = updates;

    if (frameRequestRef.current === null) {
      frameRequestRef.current = requestAnimationFrame(() => {
        setState((prev) => {
          const updates = pendingUpdates.current;
          pendingUpdates.current = null;
          frameRequestRef.current = null;

          if (typeof updates === 'function') {
            return { ...prev, ...updates(prev) };
          }
          return updates ? { ...prev, ...updates } : prev;
        });
      });
    }
  }, []);

  return [state, batchedSetState] as const;
}

// Clear all caches
export function clearAllCaches() {
  apiCache.clear();
  if (typeof window !== 'undefined') {
    // Clear localStorage except essential data
    const essentialKeys = ['mindhack_training_progress', 'mindhack_preferences', 'mindhack_panic_mode'];
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !essentialKeys.some(ek => key.startsWith(ek))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}
