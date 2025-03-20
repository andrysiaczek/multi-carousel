import { useEffect, useMemo } from 'react';
import { CarouselGrid } from '../components/CarouselGrid';
import { DecisionChipsPanel } from '../components/DecisionChipsPanel';
import { FilterAxisSelector } from '../components/FilterAxisSelector';
import { useAxisFilterStore } from '../store/useAxisFilterStore';
import { useCarouselStore } from '../store/useCarouselStore';
import { useFilterOptionsStore } from '../store/useFilterOptionsStore';

export const CarouselPage = () => {
  const {
    resetPosition,
    totalRows,
    totalColumns,
    updateCarouselData,
    updateCarouselSizeAndLabels,
  } = useCarouselStore();
  const { filters, getFilterLabels, getFilterSublabels } =
    useFilterOptionsStore();
  const { xAxisFilter, yAxisFilter } = useAxisFilterStore();

  const xLabels = useMemo(
    () => getFilterLabels(xAxisFilter),
    [xAxisFilter, getFilterLabels]
  );
  const yLabels = useMemo(
    () => getFilterLabels(yAxisFilter),
    [yAxisFilter, getFilterLabels]
  );

  const xSublabels = useMemo(
    () => getFilterSublabels(xAxisFilter),
    [xAxisFilter, getFilterSublabels]
  );
  const ySublabels = useMemo(
    () => getFilterSublabels(yAxisFilter),
    [yAxisFilter, getFilterSublabels]
  );

  // Update carousel accommodations when X or Y axis filter selection changes
  useEffect(() => {
    updateCarouselData(xAxisFilter, yAxisFilter, filters);
  }, [xAxisFilter, yAxisFilter, filters, updateCarouselData]);

  // Reset carousel position to (0,0) when X or Y axis filter selection changes
  useEffect(() => {
    resetPosition();
  }, [xAxisFilter, yAxisFilter, resetPosition]);

  useEffect(() => {
    if (totalRows !== yLabels.length || totalColumns !== xLabels.length) {
      updateCarouselSizeAndLabels(
        yLabels.length,
        xLabels.length,
        xLabels,
        yLabels,
        xSublabels,
        ySublabels
      );
    }
  }, [
    totalRows,
    totalColumns,
    xLabels,
    yLabels,
    xSublabels,
    ySublabels,
    updateCarouselSizeAndLabels,
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
