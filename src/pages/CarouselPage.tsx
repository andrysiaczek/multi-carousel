import { useEffect, useMemo } from 'react';
import { CarouselGrid } from '../components/CarouselGrid';
import { DecisionChipsPanel } from '../components/DecisionChipsPanel';
import { FilterAxisSelector } from '../components/FilterAxisSelector';
import { useAxisFilterStore } from '../store/useAxisFilterStore';
import { useCarouselStore } from '../store/useCarouselStore';
import { useFilterOptionsStore } from '../store/useFilterOptionsStore';

export const CarouselPage = () => {
  const { xAxisFilter, yAxisFilter } = useAxisFilterStore();
  const { filterOptions } = useFilterOptionsStore();
  const { updateGridSize, resetPosition } = useCarouselStore();

  const validKeys = useMemo(
    () => ['price', 'reviews', 'distance', 'type'] as const,
    []
  );
  type FilterKey = (typeof validKeys)[number];

  const xKey = xAxisFilter.toLowerCase() as FilterKey;
  const yKey = yAxisFilter.toLowerCase() as FilterKey;

  const extractFirstLevelLabels = (
    data: string[] | { label: string }[]
  ): string[] => {
    return Array.isArray(data) && typeof data[0] === 'string'
      ? (data as string[])
      : (data as { label: string }[]).map((item) => item.label);
  };

  const xLabels = useMemo(
    () =>
      validKeys.includes(xKey) && filterOptions[xKey]
        ? extractFirstLevelLabels(filterOptions[xKey])
        : [],
    [validKeys, xKey, filterOptions]
  );

  const yLabels = useMemo(
    () =>
      validKeys.includes(yKey) && filterOptions[yKey]
        ? extractFirstLevelLabels(filterOptions[yKey])
        : [],
    [validKeys, yKey, filterOptions]
  );

  // Reset carousel position to (0,0) when X or Y axis filter selection changes
  useEffect(() => {
    resetPosition();
  }, [xAxisFilter, yAxisFilter, resetPosition]);

  useEffect(() => {
    updateGridSize(yLabels.length, xLabels.length, xLabels, yLabels);
  }, [xLabels, yLabels, updateGridSize]);

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
