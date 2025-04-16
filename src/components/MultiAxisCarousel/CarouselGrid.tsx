import { useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import {
  CarouselCell,
  ResetButtonCarousel as ResetButton,
} from '../../components';
import { useResponsiveCarousel } from '../../hooks';
import {
  useCarouselStore,
  useDecisionChipsStore,
  useFilterHistoryStore,
} from '../../store';
import { Axis, Subrange } from '../../types';

export const CarouselGrid = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    rowOffset,
    columnOffset,
    cellHeight,
    cellWidth,
    visibleRows,
    visibleColumns,
    scrollLeft,
    scrollRight,
    scrollUp,
    scrollDown,
    resetPosition,
    hoveredRow,
    hoveredColumn,
    columnRanges,
    rowRanges,
    dataPerCell,
    applyDecisionChipsToCarousel,
    setCellSize,
    updateVisibleCarouselSize,
    drillDownColumn,
    drillDownRow,
    setHoveredRow,
    setHoveredColumn,
    resetHover,
  } = useCarouselStore();
  const { selectedChips } = useDecisionChipsStore();
  const { setHoveredStepForAxis, resetHoveredStep } = useFilterHistoryStore();

  useResponsiveCarousel({
    ref: carouselRef,
    maxCols: 3,
    maxRows: 2,
    minCellWidth: 250,
    minCellHeight: 200,
    gap: 8,
    onResize: (cols, rows, width, height) => {
      setCellSize(width, height);
      updateVisibleCarouselSize(rows, cols);
    },
  });

  const visibleColumnRanges = columnRanges.slice(
    columnOffset,
    columnOffset + visibleColumns
  );
  const visibleRowRanges = rowRanges.slice(rowOffset, rowOffset + visibleRows);

  const handleMouseEnter = (axis: Axis, index: number, range: Subrange) => {
    if (axis === Axis.X) setHoveredColumn(columnOffset + index);
    else setHoveredRow(rowOffset + index);
    setHoveredStepForAxis(axis, range);
  };

  const handleMouseLeave = () => {
    resetHover();
    resetHoveredStep();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollLeft();
      if (e.key === 'ArrowRight') scrollRight();
      if (e.key === 'ArrowUp') scrollUp();
      if (e.key === 'ArrowDown') scrollDown();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollLeft, scrollRight, scrollUp, scrollDown]);

  useEffect(() => {
    applyDecisionChipsToCarousel();
  }, [selectedChips, applyDecisionChipsToCarousel]);

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      {/* Column Headers (X-Axis Labels) */}
      <div className="flex w-full">
        {/* Space for row headers */}
        <div className="w-24" />
        <div
          className={`flex flex-1 gap-2 h-16 justify-center items-center font-medium text-sm text-gray-500`}
          style={{
            width: `${visibleColumns * cellWidth + (visibleColumns - 1) * 8}px`,
          }}
        >
          {visibleColumnRanges.map((colRange, colIndex) => (
            <div
              key={colRange.label}
              className={`text-center text-pretty p-2 cursor-pointer ${
                hoveredColumn === columnOffset + colIndex
                  ? 'font-semibold text-darkOrange'
                  : ''
              }`}
              style={{
                width: `${cellWidth}px`,
              }}
              onMouseEnter={() => handleMouseEnter(Axis.X, colIndex, colRange)}
              onMouseLeave={() => handleMouseLeave()}
              onClick={() => drillDownColumn(columnOffset + colIndex)}
            >
              {colRange.label}
              <br />
              <span
                className={`text-xs ${
                  hoveredColumn === columnOffset + colIndex
                    ? 'font-semibold text-darkOrange'
                    : 'text-gray-400'
                }`}
              >
                {colRange.sublabel ?? ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Position Button at the Intersection */}
      <ResetButton
        onClick={resetPosition}
        disabled={rowOffset === 0 && columnOffset === 0}
      />

      <div className="flex w-full h-full">
        {/* Row Headers (Y-Axis Labels) */}
        <div
          className={`flex flex-shrink-0 w-24 h-[${
            visibleRows * cellHeight + (visibleRows - 1) * 8
          }px] my-[36px]`}
        >
          <div
            className={`flex flex-col w-full h-full items-center justify-content gap-2 font-medium text-sm text-gray-500`}
          >
            {visibleRowRanges.map((rowRange, rowIndex) => (
              <div
                key={`${rowRange.label}`}
                className={`flex flex-col gap-0.5 justify-center text-center -rotate-90 origin-center cursor-pointer ${
                  hoveredRow === rowOffset + rowIndex
                    ? 'font-semibold text-darkOrange'
                    : ''
                }`}
                style={{ height: `${cellHeight}px` }}
                onMouseEnter={() =>
                  handleMouseEnter(Axis.Y, rowIndex, rowRange)
                }
                onMouseLeave={() => handleMouseLeave()}
                onClick={() => drillDownRow(rowOffset + rowIndex)}
              >
                <span style={{ width: `${cellHeight}px` }}>
                  {rowRange.label}
                </span>
                <span
                  className={`text-xs ${
                    hoveredRow === rowOffset + rowIndex
                      ? 'font-semibold text-darkOrange'
                      : 'text-gray-400'
                  }`}
                  style={{ width: `${cellHeight}px` }}
                >
                  {rowRange.sublabel ?? ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel + Arrows */}
        <div className="relative w-full h-full">
          {/* Carousel */}
          <div ref={carouselRef} className="overflow-auto w-full h-full p-2">
            <div
              className="grid gap-2 transition-transform w-full h-full grid place-content-center"
              style={{
                gridTemplateColumns: `repeat(${visibleColumns}, ${cellWidth}px)`,
                gridTemplateRows: `repeat(${visibleRows}, ${cellHeight}px)`,
              }}
            >
              {Array.from({ length: visibleRows }).map((_, rowIndex) =>
                Array.from({ length: visibleColumns }).map((_, colIndex) => {
                  const row = dataPerCell[rowOffset + rowIndex];
                  const cell = row ? row[columnOffset + colIndex] : null;

                  return (
                    <CarouselCell
                      key={`${rowOffset + rowIndex}-${columnOffset + colIndex}`}
                      col={columnOffset + colIndex}
                      row={rowOffset + rowIndex}
                      columnRange={columnRanges[columnOffset + colIndex]}
                      rowRange={rowRanges[rowOffset + rowIndex]}
                      accommodations={cell ? cell.accommodations : []}
                      isFillerCell={!cell}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Arrows (subtle) */}
          <button
            type="button"
            onClick={scrollLeft}
            className="absolute left-[6px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="absolute right-[6px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            onClick={scrollUp}
            className="absolute top-[6px] left-1/2 -translate-x-1/2 bg-white/80 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
          >
            <ChevronUp size={18} />
          </button>
          <button
            type="button"
            onClick={scrollDown}
            className="absolute bottom-[6px] left-1/2 -translate-x-1/2 bg-white/80 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
