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

export const getRecentApodDates = (count: number): (string | undefined)[] => {
  const dates: (string | undefined)[] = [undefined];

  for (let offset = 0; offset < count; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }

  return [...new Set(dates)];
};

export const formatDate = (dateString: string): string => {
  const date = dateString.includes('T')
    ? new Date(dateString)
    : new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

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
