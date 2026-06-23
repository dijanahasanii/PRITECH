import type { ApodData } from '../types/nasa';

export const isApodVideo = (apod: ApodData): boolean => apod.media_type === 'video';

export const getApodThumbnailUrl = (apod: ApodData): string | undefined => {
  if (isApodVideo(apod)) {
    return apod.thumbnail_url || apod.url;
  }

  return apod.hdurl || apod.url;
};

export const getApodWatchUrl = (apod: ApodData): string => apod.url;

export const getApodWatchLabel = (apod: ApodData): string =>
  isApodVideo(apod) ? 'Watch on NASA' : 'Open on NASA';
