import { Accommodation, SortOption } from '../types';

export const sortAccommodations = (
  accommodations: Accommodation[],
  field: SortOption,
  ascending: boolean
) => {
  return [...accommodations].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return ascending ? valueA - valueB : valueB - valueA;
    }
    return 0;
  });
};
