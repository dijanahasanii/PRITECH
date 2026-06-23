import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  getDisplayCachedApod,
  getTodaysCachedApod,
  loadTodaysApod,
  refreshTodaysApod,
} from '../services/nasaService';
import type { ApodData } from '../types/nasa';

interface ApodContextValue {
  apod: ApodData | null;
  isLoading: boolean;
  error: string | null;
  refreshApod: () => Promise<void>;
}

const ApodContext = createContext<ApodContextValue | null>(null);

export const ApodProvider = ({ children }: { children: ReactNode }) => {
  const [apod, setApod] = useState<ApodData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      const cachedApod = (await getTodaysCachedApod()) ?? (await getDisplayCachedApod());
      if (!active) {
        return;
      }

      if (cachedApod) {
        setApod(cachedApod);
        setIsLoading(false);
      }

      const result = await loadTodaysApod((updatedApod) => {
        if (active) {
          setApod(updatedApod);
          setError(null);
          setIsLoading(false);
        }
      });

      if (!active) {
        return;
      }

      if (result.apod) {
        setApod(result.apod);
      }

      setError(result.error);
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const refreshApod = useCallback(async () => {
    if (!apod) {
      setIsLoading(true);
    }

    setError(null);
    const result = await refreshTodaysApod();

    if (result.apod) {
      setApod(result.apod);
    }

    setError(result.error);
    setIsLoading(false);
  }, [apod]);

  const value = useMemo(
    () => ({ apod, isLoading, error, refreshApod }),
    [apod, isLoading, error, refreshApod],
  );

  return <ApodContext.Provider value={value}>{children}</ApodContext.Provider>;
};

export const useApod = (): ApodContextValue => {
  const context = useContext(ApodContext);
  if (!context) {
    throw new Error('useApod must be used within ApodProvider');
  }

  return context;
};
