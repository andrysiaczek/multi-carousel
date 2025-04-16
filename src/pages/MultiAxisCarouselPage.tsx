import { useEffect } from 'react';
import {
  CarouselGrid,
  DecisionChipsPanel,
  FilterAxisSelector,
  FilterHistoryPanel,
} from '../components';
import { useAxisFilterStore, useCarouselStore } from '../store';
import { Axis } from '../types';
import {
  resetColumnOffset,
  resetRowOffset,
  updateAvailableChips,
} from '../utils';

export const MultiAxisCarouselPage = () => {
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

  // Update carousel content and available chips when axis filters or underlying data change
  useEffect(() => {
    populateCarouselData();
    updateAvailableChips(carouselData);
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
    <div className="flex flex-col w-screen h-screen px-8 py-4 overflow-hidden">
      {/* Decision Chips Panel */}
      <div className="flex-shrink-0">
        <DecisionChipsPanel />
      </div>

      <div className="flex-shrink-0">
        <FilterHistoryPanel />
      </div>

      {/* Axis Selectors + Carousel */}
      <div className="flex flex-col flex-1 items-center overflow-hidden">
        {/* X-Axis Filter (Above the Carousel) */}
        <div className="flex flex-shrink-0 w-full ml-48 justify-center">
          <FilterAxisSelector axis={Axis.X} />
        </div>

        {/* Main Carousel with Y-Axis Filter on the Left */}
        <div className="flex flex-1 overflow-hidden w-full h-full">
          {/* Y-Axis Filter */}
          <div className="flex flex-shrink-0 flex-col w-24 mt-16 justify-center">
            <FilterAxisSelector axis={Axis.Y} />
          </div>

          {/* Carousel */}
          <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
            <CarouselGrid />
          </div>
        </div>
      </div>
    </div>
  );
};
