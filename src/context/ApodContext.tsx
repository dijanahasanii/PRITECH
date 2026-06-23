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
  refreshApod: () => Promise<void>;
}

const ApodContext = createContext<ApodContextValue | null>(null);

export const ApodProvider = ({ children }: { children: ReactNode }) => {
  const [apod, setApod] = useState<ApodData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

      const todaysApod = await loadTodaysApod((updatedApod) => {
        if (active) {
          setApod(updatedApod);
          setIsLoading(false);
        }
      });

      if (!active) {
        return;
      }

      if (todaysApod) {
        setApod(todaysApod);
      }

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

    const todaysApod = await refreshTodaysApod();
    setApod(todaysApod);
    setIsLoading(false);
  }, [apod]);

  const value = useMemo(
    () => ({ apod, isLoading, refreshApod }),
    [apod, isLoading, refreshApod],
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
