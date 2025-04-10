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
    <>
      {/* <LogoHeader size="small" /> */}
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Decision Chips Panel */}
        <div className="flex-shrink-0">
          <DecisionChipsPanel />
        </div>

        <div className="flex-shrink-0">
          <FilterHistoryPanel />
        </div>

        {/* Axis Selectors + Carousel */}
        <div className="flex flex-col flex-1 items-center overflow-hidden pl-2 pr-6">
          {/* X-Axis Filter (Above the Carousel) */}
          <div className="w-full flex justify-center mb-2">
            <div className="w-fit ml-[205px]">
              <FilterAxisSelector axis={Axis.X} />
            </div>
          </div>

          {/* Main Carousel with Y-Axis Filter on the Left */}
          <div className="flex flex-1 overflow-hidden">
            {/* Y-Axis Filter */}
            <div className="flex pr-2 mt-44">
              <div className="h-fit">
                <FilterAxisSelector axis={Axis.Y} />
              </div>
            </div>

            {/* Carousel */}
            <div className="flex-1 overflow-hidden">
              <div className="h-fit w-fit">
                <CarouselGrid />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
