import { NASA_API_KEY, NASA_APOD_URL } from '../constants/nasa';
import { loadCachedApod, saveCachedApod } from '../storage/apodStorage';
import type { ApodData } from '../types/nasa';
import { isRecentApodDate, isTodayApodDate } from '../utils/date';

const INITIAL_TIMEOUT_MS = 25_000;
const REFRESH_TIMEOUT_MS = 30_000;
const RETRY_DELAY_MS = 3_000;
const MAX_FETCH_ATTEMPTS = 4;

const isTransientHttpStatus = (status: number): boolean =>
  status === 503 || status === 502 || status === 504;

const getHttpErrorMessage = (status: number): string => {
  if (status === 429) {
    return 'NASA API rate limit reached. Wait a moment and try again.';
  }

  if (status === 503) {
    return 'NASA API is temporarily unavailable. Please try again in a moment.';
  }

  if (status === 502 || status === 504) {
    return 'NASA API is not responding right now. Please try again.';
  }

  return `NASA API request failed (${status})`;
};

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

  if (response.status === 429 || isTransientHttpStatus(response.status)) {
    throw new Error(getHttpErrorMessage(response.status));
  }

  if (!body.trim()) {
    throw new Error(`NASA API returned an empty response (${response.status})`);
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(body) as Record<string, unknown>;
  } catch {
    throw new Error(
      response.ok
        ? 'NASA API returned an unexpected response format.'
        : getHttpErrorMessage(response.status),
    );
  }

  if (raw.error) {
    const message =
      typeof raw.error === 'object' && raw.error !== null && 'message' in raw.error
        ? String((raw.error as { message?: string }).message)
        : 'NASA API error';
    throw new Error(message);
  }

  if (!response.ok) {
    throw new Error(getHttpErrorMessage(response.status));
  }

  if (!raw.date || !raw.url) {
    throw new Error('NASA API response was missing required fields');
  }

  return normalizeApod(raw);
};

const buildApodUrl = (): string => {
  const params = new URLSearchParams({
    api_key: NASA_API_KEY,
    thumbs: 'true',
  });

  return `${NASA_APOD_URL}?${params.toString()}`;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCurrentApod = async (): Promise<ApodData> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_FETCH_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        buildApodUrl(),
        attempt === 0 ? INITIAL_TIMEOUT_MS : REFRESH_TIMEOUT_MS,
      );
      return parseApodResponse(response);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Failed to fetch APOD');
    }

    if (attempt < MAX_FETCH_ATTEMPTS - 1) {
      await wait(RETRY_DELAY_MS * (attempt + 1));
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

const refreshInBackground = (onUpdated?: (apod: ApodData) => void): void => {
  void (async () => {
    try {
      const liveApod = await fetchCurrentApod();
      await saveCachedApod(liveApod);
      onUpdated?.(liveApod);
    } catch (error) {
      if (__DEV__) {
        console.warn('NASA APOD refresh failed:', toErrorMessage(error));
      }
    }
  })();
};

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

  const fallbackApod = (await getDisplayCachedApod()) ?? (await getAnyCachedApod());

  try {
    const liveApod = await fetchCurrentApod();
    await saveCachedApod(liveApod);
    return { apod: liveApod, error: null };
  } catch (error) {
    const message = toErrorMessage(error);

    if (__DEV__) {
      console.warn('NASA APOD fetch failed:', message);
    }

    if (fallbackApod) {
      refreshInBackground(onUpdated);
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
