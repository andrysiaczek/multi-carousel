import { useDecisionChipsStore } from '../store';
import { Accommodation, CarouselCell, FilterOption, Subrange } from '../types';
import { filterAccommodationsMultiAxisCarousel } from '../utils';

export const buildCarouselGrid = (
  xRanges: Subrange[],
  yRanges: Subrange[],
  data: Accommodation[],
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption
): { carousel: CarouselCell[][]; accommodations: Accommodation[] } => {
  const { selectedChips } = useDecisionChipsStore.getState();

  const carousel: CarouselCell[][] = [];
  const accommodations: Accommodation[] = [];

  for (let row = 0; row < yRanges.length; row++) {
    carousel[row] = [];
    for (let col = 0; col < xRanges.length; col++) {
      const xRange = xRanges[col];
      const yRange = yRanges[row];

      let filtered = filterAccommodationsMultiAxisCarousel(
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

      // Apply Decision Chips as a second filtering layer
      if (selectedChips.length > 0) {
        filtered = filtered.filter((acc) =>
          selectedChips.every((chip) => acc.features?.includes(chip))
        );
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
