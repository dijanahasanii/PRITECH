export const getTodayApodDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayApodDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isTodayApodDate = (dateString: string): boolean =>
  dateString === getTodayApodDate();

export const isRecentApodDate = (dateString: string): boolean =>
  dateString === getTodayApodDate() || dateString === getYesterdayApodDate();
