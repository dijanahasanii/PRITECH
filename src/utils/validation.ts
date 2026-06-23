export const validateTitle = (title: string): string | null => {
  const trimmed = title.trim();
  if (!trimmed) {
    return 'Title is required';
  }
  return null;
};
