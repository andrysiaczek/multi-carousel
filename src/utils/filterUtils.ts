import { Accommodation, FilterOption, Subrange } from '../types';
import { clean } from '../utils';

export const filterAccommodations = (
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
