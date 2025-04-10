import { Accommodation, FilterOption, Subrange } from '../types';
import { clean } from '../utils';

export const filterAccommodationsMultiAxisCarousel = (
  data: Accommodation[],
  xRange: Subrange,
  yRange: Subrange,
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption
): Accommodation[] => {
  return data.filter((acc) => {
    const isXMatch =
      !xRange.lowerBound && !xRange.upperBound // Checking if Type filter
        ? acc.type === xRange.label
        : (!xRange.lowerBound ||
            (acc[xAxisFilter] as number) >= xRange.lowerBound) &&
          (!xRange.upperBound ||
            (acc[xAxisFilter] as number) < xRange.upperBound);

    const isYMatch =
      !yRange.lowerBound && !yRange.upperBound // Checking if Type filter
        ? acc.type === yRange.label
        : (!yRange.lowerBound ||
            (acc[yAxisFilter] as number) >= yRange.lowerBound) &&
          (!yRange.upperBound ||
            (acc[yAxisFilter] as number) < yRange.upperBound);

    return isXMatch && isYMatch;
  });
};

export const filterAccommodationsSingleAxisCarousel = (
  data: Accommodation[],
  filterOption: FilterOption,
  selectedLabel: string,
  selectedChips: string[]
): Accommodation[] => {
  const range = getRangeFromLabel(filterOption, selectedLabel);

  return data.filter((acc) => {
    const matchesChips = selectedChips.every((chip) =>
      acc.features.includes(chip)
    );

    switch (filterOption) {
      case FilterOption.Price:
        return (
          (range.lowerBound === null || acc.price >= range.lowerBound) &&
          (range.upperBound === null || acc.price < range.upperBound) &&
          matchesChips
        );
      case FilterOption.Distance:
        return (
          (range.lowerBound === null || acc.distance >= range.lowerBound) &&
          (range.upperBound === null || acc.distance < range.upperBound) &&
          matchesChips
        );
      case FilterOption.Rating:
        return (
          (range.lowerBound === null || acc.rating >= range.lowerBound) &&
          (range.upperBound === null || acc.rating < range.upperBound) &&
          matchesChips
        );
      case FilterOption.Type:
        return acc.type === selectedLabel && matchesChips;
      default:
        return false;
    }
  });
};

// Helper to get range from label
const getRangeFromLabel = (filter: FilterOption, label: string) => {
  const rangeMap: Record<
    string,
    { lowerBound: number | null; upperBound: number | null }
  > = {
    'price: Very Low': { lowerBound: null, upperBound: 50 },
    'price: Low': { lowerBound: 50, upperBound: 100 },
    'price: Medium': { lowerBound: 100, upperBound: 250 },
    'price: High': { lowerBound: 250, upperBound: null },
    'distance: Very Close': { lowerBound: null, upperBound: 1 },
    'distance: Close': { lowerBound: 1, upperBound: 3 },
    'distance: Medium Distance': { lowerBound: 3, upperBound: 6 },
    'distance: Far': { lowerBound: 6, upperBound: null },
    'rating: Low': { lowerBound: null, upperBound: 3 },
    'rating: Medium': { lowerBound: 3, upperBound: 4 },
    'rating: High': { lowerBound: 4, upperBound: 4.5 },
    'rating: Very High': { lowerBound: 4.5, upperBound: null },
  };

  return (
    rangeMap[`${filter}: ${label}`] || { lowerBound: null, upperBound: null }
  );
};

export const findSubrangeByLabel = (
  ranges: Subrange[],
  label: string
): Subrange | null => {
  for (const range of ranges) {
    if (clean(range.label) === clean(label)) return range;
    if (range.subranges) {
      const found = findSubrangeByLabel(range.subranges, label);
      if (found) return found;
    }
  }
  return null;
};
