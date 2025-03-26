import { useEffect, useRef } from 'react';
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
  const { setHoveredStep, resetHoveredStep } = useFilterHistoryStore();

  const visibleColumnRanges = columnRanges.slice(
    columnOffset,
    columnOffset + visibleColumns
  );
  const visibleRowRanges = rowRanges.slice(rowOffset, rowOffset + visibleRows);

  const handleMouseEnter = (axis: Axis, index: number, range: Subrange) => {
    if (axis === Axis.X) setHoveredColumn(columnOffset + index);
    else setHoveredRow(rowOffset + index);
    setHoveredStep(range);
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
    <div className="relative flex flex-col items-center p-10">
      {/* Column Headers (X-Axis Labels) */}
      <div className="flex">
        <div className="w-[120px]"></div> {/* Space for row headers */}
        <div
          className={`flex items-center gap-2 w-[${
            visibleColumns * cellWidth
          }px] h-[80px] font-medium text-sm text-gray-500`}
        >
          {visibleColumnRanges.map((colRange, colIndex) => (
            <div
              key={`${colRange.label}`}
              className={`w-[${cellWidth}px] text-center text-pretty p-2 cursor-pointer ${
                hoveredColumn === colIndex
                  ? 'font-semibold text-darkOrange'
                  : ''
              }`}
              onMouseEnter={() => handleMouseEnter(Axis.X, colIndex, colRange)}
              onMouseLeave={() => handleMouseLeave()}
              onClick={() => drillDownColumn(columnOffset + colIndex)}
            >
              {colRange.label}
              <br />
              <span
                className={`text-xs ${
                  hoveredColumn === colIndex
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
          className={`flex flex-col align-center gap-2 w-[120px] h-[${
            visibleRows * cellHeight
          }px] overflow-hidden font-medium text-sm text-gray-500`}
        >
          {visibleRowRanges.map((rowRange, rowIndex) => (
            <div
              key={`${rowRange.label}`}
              className={`w-[120px] h-[${cellHeight}px] flex flex-col items-center justify-center -rotate-90 origin-center p-2 text-pretty cursor-pointer ${
                hoveredRow === rowIndex ? 'font-semibold text-darkOrange' : ''
              }`}
              onMouseEnter={() => handleMouseEnter(Axis.Y, rowIndex, rowRange)}
              onMouseLeave={() => handleMouseLeave()}
              onClick={() => drillDownRow(rowOffset + rowIndex)}
            >
              {rowRange.label}
              <br />
              <span
                className={`text-xs ${
                  hoveredRow === rowIndex
                    ? 'font-semibold text-darkOrange'
                    : 'text-gray-400'
                }`}
              >
                {rowRange.sublabel ?? ''}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable Grid Container */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden border rounded-lg"
          style={{
            width: `${visibleColumns * cellWidth + (visibleColumns - 1) * 8}px`,
            height: `${visibleRows * cellHeight + (visibleRows - 1) * 8}px`,
          }}
        >
          <div
            className="grid transition-transform gap-2"
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
      </div>

      {/* Navigation Buttons */}
      <button
        type="button"
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 transition"
      >
        ←
      </button>
      <button
        type="button"
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 transition"
      >
        →
      </button>
      <button
        type="button"
        onClick={scrollUp}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 transition"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={scrollDown}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 transition"
      >
        ↓
      </button>
    </div>
  );
};
