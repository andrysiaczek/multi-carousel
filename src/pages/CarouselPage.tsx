import { useEffect } from 'react';
import {
  CarouselGrid,
  DecisionChipsPanel,
  FilterAxisSelector,
  FilterHistoryPanel,
} from '../components';
import { useAxisFilterStore, useCarouselStore } from '../store';
import { Axis } from '../types';
import { resetColumnOffset, resetRowOffset } from '../utils';

export const CarouselPage = () => {
  const {
    resetPosition,
    totalRows,
    totalColumns,
    columnRanges,
    rowRanges,
    carouselData,
    populateCarouselData,
    updateCarouselSize,
  } = useCarouselStore();
  const { xAxisFilter, yAxisFilter } = useAxisFilterStore();

  // Update carousel content when axis filters or underlying data change
  useEffect(() => {
    populateCarouselData();
  }, [xAxisFilter, yAxisFilter, carouselData, populateCarouselData]);

  // Update carousel size and reset its position when axis filters or their range counts change
  useEffect(() => {
    const rowCount = rowRanges.length;
    const columnCount = columnRanges.length;

    const rowsChanged = totalRows !== rowCount;
    const columnsChanged = totalColumns !== columnCount;

    if (!rowsChanged && !columnsChanged) return;

    updateCarouselSize(rowCount, columnCount);

    if (rowsChanged && !columnsChanged) {
      return resetRowOffset();
    }

    if (columnsChanged && !rowsChanged) {
      return resetColumnOffset();
    }

    resetPosition();
  }, [
    totalRows,
    totalColumns,
    rowRanges.length,
    columnRanges.length,
    xAxisFilter,
    yAxisFilter,
    updateCarouselSize,
    resetPosition,
  ]);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Decision Chips Panel */}
      <DecisionChipsPanel />

      {/* Filter History Panel */}
      <FilterHistoryPanel />

      {/* X-Axis Filter (Above the Carousel) */}
      <FilterAxisSelector axis={Axis.X} />

      {/* Main Carousel with Y-Axis Filter on the Left */}
      <div className="flex">
        {/* Y-Axis Filter */}
        <FilterAxisSelector axis={Axis.Y} />

        {/* Carousel */}
        <CarouselGrid />
      </div>
    </div>
  );
};
