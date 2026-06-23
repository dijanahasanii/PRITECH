import type { ApodData } from '../types/nasa';

export const isApodVideo = (apod: ApodData): boolean => apod.media_type === 'video';

export const isDirectVideoFile = (url: string): boolean =>
  /\.(mp4|webm|mov)(\?|$)/i.test(url);

const getYoutubeVideoId = (url: string): string | null => {
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&/]+)/i);
  if (embedMatch?.[1]) {
    return embedMatch[1];
  }

  const watchMatch = url.match(/[?&]v=([^&]+)/i);
  if (watchMatch?.[1]) {
    return watchMatch[1];
  }

  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/i);
  if (shortMatch?.[1]) {
    return shortMatch[1];
  }

  return null;
};

const getVideoThumbnailUrl = (apod: ApodData): string | undefined => {
  if (apod.thumbnail_url?.startsWith('http')) {
    return apod.thumbnail_url;
  }

  const videoId = getYoutubeVideoId(apod.url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  return undefined;
};

export const getApodThumbnailUrl = (apod: ApodData): string | undefined => {
  if (isApodVideo(apod)) {
    return getVideoThumbnailUrl(apod);
  }

  return apod.hdurl || apod.url;
};

export const getApodDirectVideoUrl = (apod: ApodData): string | undefined => {
  if (!isApodVideo(apod) || !isDirectVideoFile(apod.url)) {
    return undefined;
  }

  return apod.url;
};

export const getApodWatchUrl = (apod: ApodData): string => apod.url;

export const getApodWatchLabel = (apod: ApodData): string =>
  isApodVideo(apod) ? 'Watch on NASA' : 'Open on NASA';
