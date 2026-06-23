export interface ApodData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  media_type: 'image' | 'video';
  hdurl?: string;
  thumbnail_url?: string;
}
