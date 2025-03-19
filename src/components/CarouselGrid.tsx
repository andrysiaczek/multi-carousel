import { useEffect, useRef } from 'react';
import { useCarouselStore } from '../store/useCarouselStore';
import { CarouselCell } from './CarouselCell';

export const CarouselGrid = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    cellHeight,
    cellWidth,
    visibleRows,
    visibleColumns,
    currentXLabels,
    currentYLabels,
    scrollLeft,
    scrollRight,
    scrollUp,
    scrollDown,
  } = useCarouselStore();

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

  return (
    <div className="relative flex flex-col items-center p-10">
      {/* Column Headers (X-Axis Labels) */}
      <div className="flex">
        <div className="w-[120px]"></div> {/* Space for row headers */}
        <div
          className={`flex items-center w-[${
            visibleColumns * cellWidth
          }px] h-[80px] font-medium text-sm text-gray-500`}
        >
          {currentXLabels.map((xLabel, col) => (
            <div
              key={col}
              className={`w-[${cellWidth}px] text-center text-pretty p-2`}
            >
              {xLabel}
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Row Headers (Y-Axis Labels) */}
        <div
          className={`flex flex-col align-center w-[120px] h-[${
            visibleRows * cellHeight
          }px] overflow-hidden font-medium text-sm text-gray-500`}
        >
          {currentYLabels.map((yLabel, row) => (
            <div
              key={row}
              className={`w-[120px] h-[${cellHeight}px] flex items-center justify-center -rotate-90 origin-center p-2 text-pretty`}
            >
              {yLabel}
            </div>
          ))}
        </div>

        {/* Scrollable Grid Container */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden border rounded-lg"
          style={{
            width: `${visibleColumns * cellWidth}px`,
            height: `${visibleRows * cellHeight}px`,
          }}
        >
          <div
            className="grid transition-transform"
            style={{
              gridTemplateColumns: `repeat(${visibleColumns}, ${cellWidth}px)`,
              gridTemplateRows: `repeat(${visibleRows}, ${cellHeight}px)`,
            }}
          >
            {Array.from({ length: visibleRows }).map((_, row) =>
              Array.from({ length: visibleColumns }).map((_, col) => (
                <CarouselCell
                  key={`${row}-${col}`}
                  row={row}
                  col={col}
                  xLabel={
                    currentXLabels[col] && currentYLabels[row]
                      ? currentXLabels[col]
                      : ''
                  }
                  yLabel={
                    currentXLabels[col] && currentYLabels[row]
                      ? currentYLabels[row]
                      : ''
                  }
                />
              ))
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
