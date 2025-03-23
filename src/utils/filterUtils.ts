import { Accommodation, CarouselCell, FilterOption, Subrange } from '../types';
import { clean } from '../utils';

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

export const buildCarouselGrid = (
  xRanges: Subrange[],
  yRanges: Subrange[],
  data: Accommodation[],
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption
): { carousel: CarouselCell[][]; accommodations: Accommodation[] } => {
  const carousel: CarouselCell[][] = [];
  const accommodations: Accommodation[] = [];

  for (let row = 0; row < yRanges.length; row++) {
    carousel[row] = [];
    for (let col = 0; col < xRanges.length; col++) {
      const xRange = xRanges[col];
      const yRange = yRanges[row];

      const filtered = filterAccommodations(
        data,
        xRange,
        yRange,
        xAxisFilter,
        yAxisFilter
      );

      for (const acc of filtered) {
        if (!accommodations.some((a) => a.id === acc.id)) {
          accommodations.push(acc);
        }
      }

      carousel[row][col] = {
        row,
        column: col,
        accommodations: filtered,
      };
    }
  }

  return { carousel, accommodations };
};
