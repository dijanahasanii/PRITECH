import { FALLBACK_APOD } from '../constants/fallbackApod';
import { NASA_API_KEY, NASA_APOD_URL } from '../constants/nasa';
import { loadCachedApod, saveCachedApod } from '../storage/apodStorage';
import type { ApodData } from '../types/nasa';
import {
  getTodayApodDate,
  getYesterdayApodDate,
  isRecentApodDate,
  isTodayApodDate,
} from '../utils/date';

const FETCH_TIMEOUT_MS = 12_000;
const RETRY_DELAY_MS = 1_500;
const MAX_URL_ATTEMPTS = 2;

const isTransientHttpStatus = (status: number): boolean =>
  status === 503 || status === 502 || status === 504 || status === 429;

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
    return error.message;
  }

  return 'Failed to fetch APOD';
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

  if (isTransientHttpStatus(response.status)) {
    throw new Error(`NASA API unavailable (${response.status})`);
  }

  if (!body.trim()) {
    throw new Error(`NASA API returned an empty response (${response.status})`);
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(body) as Record<string, unknown>;
  } catch {
    throw new Error('NASA API returned an unexpected response format');
  }

  if (raw.error) {
    throw new Error('NASA API error');
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
  });

  if (date) {
    params.set('date', date);
  }

  return `${NASA_APOD_URL}?${params.toString()}`;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchApodFromUrl = async (url: string, maxAttempts: number): Promise<ApodData> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
      return parseApodResponse(response);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Failed to fetch APOD');
    }

    if (attempt < maxAttempts - 1) {
      await wait(RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError ?? new Error('Failed to fetch APOD');
};

const fetchApodForDate = async (date?: string): Promise<ApodData> =>
  fetchApodFromUrl(buildApodUrl(date), MAX_URL_ATTEMPTS);

const fetchTodaysApod = async (): Promise<ApodData> => {
  const today = getTodayApodDate();
  let lastError: Error | null = null;

  for (const date of [undefined, today] as (string | undefined)[]) {
    try {
      const apod = await fetchApodForDate(date);
      if (isTodayApodDate(apod.date)) {
        return apod;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Failed to fetch APOD');
    }
  }

  throw lastError ?? new Error('Failed to fetch today\'s APOD');
};

const fetchYesterdaysApod = async (): Promise<ApodData> => {
  const apod = await fetchApodForDate(getYesterdayApodDate());
  if (isRecentApodDate(apod.date)) {
    return apod;
  }

  throw new Error('NASA API returned an unexpected date');
};

const getAnyCachedApod = async (): Promise<ApodData | null> => {
  const cachedApod = await loadCachedApod();
  return cachedApod?.date && cachedApod?.url ? cachedApod : null;
};

export const getTodaysCachedApod = async (): Promise<ApodData | null> => {
  const cachedApod = await getAnyCachedApod();
  return cachedApod && isTodayApodDate(cachedApod.date) ? cachedApod : null;
};

export const getDisplayCachedApod = async (): Promise<ApodData | null> => {
  const cachedApod = await getAnyCachedApod();
  return cachedApod && isRecentApodDate(cachedApod.date) ? cachedApod : null;
};

const getAcceptableCachedApod = async (): Promise<ApodData | null> =>
  (await getTodaysCachedApod()) ?? (await getDisplayCachedApod());

const tryFetchLiveApod = async (): Promise<ApodData | null> => {
  try {
    const apod = await fetchTodaysApod();
    await saveCachedApod(apod);
    return apod;
  } catch (error) {
    if (__DEV__) {
      console.warn('NASA APOD today fetch failed:', toErrorMessage(error));
    }
  }

  try {
    const apod = await fetchYesterdaysApod();
    await saveCachedApod(apod);
    return apod;
  } catch (error) {
    if (__DEV__) {
      console.warn('NASA APOD yesterday fetch failed:', toErrorMessage(error));
    }
  }

  return null;
};

const refreshInBackground = (onUpdated?: (apod: ApodData) => void): void => {
  void (async () => {
    const liveApod = await tryFetchLiveApod();
    if (liveApod) {
      onUpdated?.(liveApod);
    }
  })();
};

const resolveApod = async (onUpdated?: (apod: ApodData) => void): Promise<ApodData> => {
  const cachedApod = await getAcceptableCachedApod();
  if (cachedApod) {
    refreshInBackground(onUpdated);
    return cachedApod;
  }

  const liveApod = await tryFetchLiveApod();
  if (liveApod) {
    return liveApod;
  }

  refreshInBackground(onUpdated);
  return FALLBACK_APOD;
};

export const loadTodaysApod = async (
  onUpdated?: (apod: ApodData) => void,
): Promise<{ apod: ApodData }> => {
  const apod = await resolveApod(onUpdated);
  return { apod };
};

export const refreshTodaysApod = async (
  onUpdated?: (apod: ApodData) => void,
): Promise<{ apod: ApodData }> => {
  const liveApod = await tryFetchLiveApod();
  if (liveApod) {
    onUpdated?.(liveApod);
    return { apod: liveApod };
  }

  const cachedApod = await getAcceptableCachedApod();
  if (cachedApod) {
    refreshInBackground(onUpdated);
    return { apod: cachedApod };
  }

  refreshInBackground(onUpdated);
  return { apod: FALLBACK_APOD };
};
