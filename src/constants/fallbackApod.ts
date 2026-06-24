import type { ApodData } from '../types/nasa';

// Stable archive APOD used only when NASA API and local cache are both unavailable.
export const FALLBACK_APOD: ApodData = {
  date: '2015-01-31',
  title: 'The Great Nebula in Orion',
  explanation:
    'The Great Nebula in Orion is one of the most famous star-forming regions in the night sky. Glowing gas surrounds hot young stars at the edge of a vast interstellar molecular cloud.',
  url: 'https://apod.nasa.gov/apod/image/1501/orion_hla.jpg',
  media_type: 'image',
  hdurl: 'https://apod.nasa.gov/apod/image/1501/orion_hla_full.jpg',
};
