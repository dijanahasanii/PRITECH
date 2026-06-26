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
import { ApodVideoPrefetch } from './ApodVideoContext';

interface ApodContextValue {
  apod: ApodData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refreshApod: () => Promise<void>;
}

const ApodContext = createContext<ApodContextValue | null>(null);

export const ApodProvider = ({ children }: { children: ReactNode }) => {
  const [apod, setApod] = useState<ApodData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        setIsRefreshing(true);
      }

      const result = await loadTodaysApod((updatedApod) => {
        if (active) {
          setApod(updatedApod);
          setIsLoading(false);
          setIsRefreshing(false);
        }
      });

      if (!active) {
        return;
      }

      setApod(result.apod);
      setIsLoading(false);
      setIsRefreshing(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const refreshApod = useCallback(async () => {
    setIsRefreshing(true);
    if (!apod) {
      setIsLoading(true);
    }

    const result = await refreshTodaysApod((updatedApod) => {
      setApod(updatedApod);
      setIsLoading(false);
      setIsRefreshing(false);
    });

    setApod(result.apod);
    setIsLoading(false);
    setIsRefreshing(false);
  }, [apod]);

  const value = useMemo(
    () => ({ apod, isLoading, isRefreshing, refreshApod }),
    [apod, isLoading, isRefreshing, refreshApod],
  );

  return (
    <ApodContext.Provider value={value}>
      <ApodVideoPrefetch apod={apod}>{children}</ApodVideoPrefetch>
    </ApodContext.Provider>
  );
};

export const useApod = (): ApodContextValue => {
  const context = useContext(ApodContext);
  if (!context) {
    throw new Error('useApod must be used within ApodProvider');
  }

  return context;
};
