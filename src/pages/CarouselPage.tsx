import { useEffect } from 'react';
import {
  CarouselGrid,
  DecisionChipsPanel,
  FilterAxisSelector,
} from '../components';
import {
  useAxisFilterStore,
  useCarouselStore,
  useFilterOptionsStore,
} from '../store';

export const CarouselPage = () => {
  const {
    resetPosition,
    totalRows,
    totalColumns,
    columnRanges,
    rowRanges,
    populateCarouselData,
    updateCarouselSize,
  } = useCarouselStore();
  const { filters } = useFilterOptionsStore();
  const { xAxisFilter, yAxisFilter } = useAxisFilterStore();

  // Update carousel accommodations when X or Y axis filter selection changes
  useEffect(() => {
    populateCarouselData(xAxisFilter, yAxisFilter, filters);
  }, [xAxisFilter, yAxisFilter, filters, populateCarouselData]);

  // Reset carousel position to (0,0) when X or Y axis filter selection changes
  useEffect(() => {
    resetPosition();
  }, [xAxisFilter, yAxisFilter, resetPosition]);

  useEffect(() => {
    if (
      totalRows !== rowRanges.length ||
      totalColumns !== columnRanges.length
    ) {
      updateCarouselSize(rowRanges.length, columnRanges.length);
    }
  }, [
    totalRows,
    totalColumns,
    updateCarouselSize,
    rowRanges.length,
    columnRanges.length,
  ]);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Decision Chips Panel */}
      <DecisionChipsPanel />

      {/* X-Axis Filter (Above the Carousel) */}
      <FilterAxisSelector axis="X" />

      {/* Main Carousel with Y-Axis Filter on the Left */}
      <div className="flex">
        {/* Y-Axis Filter */}
        <FilterAxisSelector axis="Y" />

        {/* Carousel */}
        <CarouselGrid />
      </div>
    </div>
  );
};
