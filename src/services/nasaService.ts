import { NASA_API_KEY, NASA_APOD_URL } from '../constants/nasa';
import { loadCachedApod, saveCachedApod } from '../storage/apodStorage';
import type { ApodData } from '../types/nasa';
import { isRecentApodDate, isTodayApodDate } from '../utils/date';

const INITIAL_TIMEOUT_MS = 25_000;
const REFRESH_TIMEOUT_MS = 30_000;
const RETRY_DELAY_MS = 2_000;
const MAX_FETCH_ATTEMPTS = 3;

const normalizeApod = (raw: Record<string, unknown>): ApodData => ({
  date: String(raw.date ?? ''),
  title: String(raw.title ?? 'Untitled'),
  explanation: String(raw.explanation ?? ''),
  url: String(raw.url ?? ''),
  media_type: raw.media_type === 'video' ? 'video' : 'image',
  hdurl: raw.hdurl ? String(raw.hdurl) : undefined,
  thumbnail_url: raw.thumbnail_url ? String(raw.thumbnail_url) : undefined,
});

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'NASA API request timed out. Try again on a stronger connection.';
    }

    return error.message;
  }

  return 'Failed to fetch today\'s APOD';
};

const fetchWithTimeout = async (url: string, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const parseApodResponse = async (response: Response): Promise<ApodData> => {
  const body = await response.text();

  if (response.status === 429) {
    throw new Error('NASA API rate limit reached. Wait a moment and try again.');
  }

  if (!body.trim()) {
    throw new Error(`NASA API returned an empty response (${response.status})`);
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(body) as Record<string, unknown>;
  } catch {
    throw new Error(`NASA API returned an invalid response (${response.status})`);
  }

  if (raw.error) {
    const message =
      typeof raw.error === 'object' && raw.error !== null && 'message' in raw.error
        ? String((raw.error as { message?: string }).message)
        : 'NASA API error';
    throw new Error(message);
  }

  if (!response.ok) {
    throw new Error(`NASA API request failed (${response.status})`);
  }

  if (!raw.date || !raw.url) {
    throw new Error('NASA API response was missing required fields');
  }

  return normalizeApod(raw);
};

const buildApodUrl = (date?: string): string => {
  const params = new URLSearchParams({
    api_key: NASA_API_KEY,
    thumbs: 'true',
  });

  if (date) {
    params.set('date', date);
  }

  return `${NASA_APOD_URL}?${params.toString()}`;
};

const fetchApodFromNetwork = async (
  date?: string,
  timeoutMs = INITIAL_TIMEOUT_MS,
): Promise<ApodData> => {
  const response = await fetchWithTimeout(buildApodUrl(date), timeoutMs);
  return parseApodResponse(response);
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCurrentApod = async (): Promise<ApodData> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_FETCH_ATTEMPTS; attempt += 1) {
    try {
      return await fetchApodFromNetwork(
        undefined,
        attempt === 0 ? INITIAL_TIMEOUT_MS : REFRESH_TIMEOUT_MS,
      );
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Failed to fetch APOD');
    }

    if (attempt < MAX_FETCH_ATTEMPTS - 1) {
      await wait(RETRY_DELAY_MS);
    }
  }

  throw lastError ?? new Error('Failed to fetch today\'s APOD');
};

const getAnyCachedApod = async (): Promise<ApodData | null> => {
  const cachedApod = await loadCachedApod();
  return cachedApod?.date && cachedApod?.url ? cachedApod : null;
};

const getBestCachedApod = async (): Promise<ApodData | null> =>
  (await getTodaysCachedApod()) ??
  (await getDisplayCachedApod()) ??
  (await getAnyCachedApod());

export const getTodaysCachedApod = async (): Promise<ApodData | null> => {
  const cachedApod = await getAnyCachedApod();
  return cachedApod && isTodayApodDate(cachedApod.date) ? cachedApod : null;
};

export const getDisplayCachedApod = async (): Promise<ApodData | null> => {
  const cachedApod = await getAnyCachedApod();
  return cachedApod && isRecentApodDate(cachedApod.date) ? cachedApod : null;
};

export const loadTodaysApod = async (
  onUpdated?: (apod: ApodData) => void,
): Promise<{ apod: ApodData | null; error: string | null }> => {
  const cachedApod = await getTodaysCachedApod();
  if (cachedApod) {
    return { apod: cachedApod, error: null };
  }

  const displayCache = await getDisplayCachedApod();

  try {
    const liveApod = await fetchCurrentApod();
    await saveCachedApod(liveApod);
    return { apod: liveApod, error: null };
  } catch (error) {
    const message = toErrorMessage(error);

    if (__DEV__) {
      console.warn('NASA APOD fetch failed:', message);
    }

    const fallbackApod = displayCache ?? (await getAnyCachedApod());
    if (fallbackApod) {
      void (async () => {
        try {
          const liveApod = await fetchCurrentApod();
          await saveCachedApod(liveApod);
          onUpdated?.(liveApod);
        } catch (refreshError) {
          if (__DEV__) {
            console.warn('NASA APOD refresh failed:', toErrorMessage(refreshError));
          }
        }
      })();

      return { apod: fallbackApod, error: null };
    }

    return { apod: null, error: message };
  }
};

export const refreshTodaysApod = async (): Promise<{
  apod: ApodData | null;
  error: string | null;
}> => {
  try {
    const liveApod = await fetchCurrentApod();
    await saveCachedApod(liveApod);
    return { apod: liveApod, error: null };
  } catch (error) {
    const message = toErrorMessage(error);

    if (__DEV__) {
      console.warn('NASA APOD refresh failed:', message);
    }

    const fallbackApod = await getBestCachedApod();
    return { apod: fallbackApod, error: fallbackApod ? null : message };
  }
};
