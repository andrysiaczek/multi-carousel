import { useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import { CarouselCell } from '../components';
import {
  useCarouselStore,
  useDecisionChipsStore,
  useFilterHistoryStore,
} from '../store';
import { Axis, Subrange } from '../types';

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
    hoveredRow,
    hoveredColumn,
    columnRanges,
    rowRanges,
    dataPerCell,
    applyDecisionChipsToCarousel,
    drillDownColumn,
    drillDownRow,
    setHoveredRow,
    setHoveredColumn,
    resetHover,
  } = useCarouselStore();
  const { selectedChips } = useDecisionChipsStore();
  const { setHoveredStepForAxis, resetHoveredStep } = useFilterHistoryStore();

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

  const gridWidth = visibleColumns * cellWidth + (visibleColumns - 1) * 8;
  const gridHeight = visibleRows * cellHeight + (visibleRows - 1) * 8;

  return (
    <div className="relative flex flex-col items-center px-4 pt-4 pb-2 h-full">
      {/* Column Headers (X-Axis Labels) */}
      <div className="flex w-full">
        {/* Space for row headers and the left arrow */}
        <div className="w-[120px] ml-6" />
        <div
          className={`flex items-center gap-2 w-[${gridWidth}px] h-[80px] font-medium text-sm text-gray-500`}
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

      <div className="flex">
        {/* Row Headers (Y-Axis Labels) */}
        <div
          className={`flex flex-col align-center justify-content gap-2 my-6 h-[${
            visibleRows * cellHeight
          }px] font-medium text-sm text-gray-500`}
        >
          {visibleRowRanges.map((rowRange, rowIndex) => (
            <div
              key={`${rowRange.label}`}
              className={`w-[120px] h-[${cellHeight}px] flex flex-col items-center text-center justify-center -rotate-90 origin-center p-2 text-pretty cursor-pointer ${
                hoveredRow === rowOffset + rowIndex
                  ? 'font-semibold text-darkOrange'
                  : ''
              }`}
              onMouseEnter={() => handleMouseEnter(Axis.Y, rowIndex, rowRange)}
              onMouseLeave={() => handleMouseLeave()}
              onClick={() => drillDownRow(rowOffset + rowIndex)}
            >
              {rowRange.label}
              <br />
              <span
                className={`text-xs ${
                  hoveredRow === rowOffset + rowIndex
                    ? 'font-semibold text-darkOrange'
                    : 'text-gray-400'
                }`}
              >
                {rowRange.sublabel ?? ''}
              </span>
            </div>
          ))}
        </div>

        {/* Carousel + Arrows */}
        <div
          className="relative m-6"
          style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }}
        >
          {/* Carousel */}
          <div
            ref={carouselRef}
            className="overflow-auto"
            style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }}
          >
            <div
              className="grid gap-2 transition-transform"
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
            className="absolute left-[-28px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="absolute right-[-28px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            onClick={scrollUp}
            className="absolute top-[-28px] left-1/2 -translate-x-1/2 bg-white/80 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
          >
            <ChevronUp size={18} />
          </button>
          <button
            type="button"
            onClick={scrollDown}
            className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 bg-white/80 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
