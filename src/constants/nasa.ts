export const NASA_DEMO_API_KEY = 'DEMO_KEY';

const PLACEHOLDER_KEYS = new Set([
  '',
  NASA_DEMO_API_KEY,
  'your_nasa_api_key_here',
  'your_key_here',
]);

const configuredKey = process.env.EXPO_PUBLIC_NASA_API_KEY?.trim() ?? '';

export const NASA_API_KEY = PLACEHOLDER_KEYS.has(configuredKey)
  ? NASA_DEMO_API_KEY
  : configuredKey;

export const NASA_USING_DEMO_KEY = NASA_API_KEY === NASA_DEMO_API_KEY;
export const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
export const NASA_WEBSITE_URL = 'https://apod.nasa.gov/apod/astropix.html';
