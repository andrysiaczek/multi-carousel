export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const clean = (str: string) => str.replace(/[^\w\s.]/g, '').trim();
