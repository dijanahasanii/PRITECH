import AsyncStorage from '@react-native-async-storage/async-storage';

import { APOD_STORAGE_KEY } from '../constants/storage';
import type { ApodData } from '../types/nasa';

export const loadCachedApod = async (): Promise<ApodData | null> => {
  try {
    const data = await AsyncStorage.getItem(APOD_STORAGE_KEY);
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data) as ApodData;
    return parsed?.date && parsed?.url ? parsed : null;
  } catch {
    return null;
  }
};

export const saveCachedApod = async (apod: ApodData): Promise<void> => {
  try {
    await AsyncStorage.setItem(APOD_STORAGE_KEY, JSON.stringify(apod));
  } catch {
    // Cache is optional; the app can still show the fetched APOD.
  }
};
