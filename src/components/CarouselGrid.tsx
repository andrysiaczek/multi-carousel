import { useEffect, useRef } from 'react';
import { useCarouselStore } from '../store/useCarouselStore';
import { CarouselCell } from './CarouselCell';

interface CarouselGridProps {
  xLabels: string[];
  yLabels: string[];
}

export const CarouselGrid = ({ xLabels, yLabels }: CarouselGridProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    rowOffset,
    columnOffset,
    scrollLeft,
    scrollRight,
    scrollUp,
    scrollDown,
    totalRows,
    totalColumns,
    visibleRows,
    visibleColumns,
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
      {/* Wrapper to prevent arrows from getting clipped */}
      <div className="relative">
        {/* Scrollable Grid Container */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden border rounded-lg"
          style={{
            width: `${visibleColumns * 200}px`,
            height: `${visibleRows * 150}px`,
          }}
        >
          <div
            className="grid transition-transform"
            style={{
              gridTemplateColumns: `repeat(${totalColumns}, 200px)`,
              gridTemplateRows: `repeat(${totalRows}, 150px)`,
              transform: `translate(${-columnOffset * 200}px, ${
                -rowOffset * 150
              }px)`,
            }}
          >
            {yLabels.map((yLabel, row) =>
              xLabels.map((xLabel, col) => (
                <CarouselCell
                  key={`${row}-${col}`}
                  row={row}
                  col={col}
                  xLabel={xLabel}
                  yLabel={yLabel}
                />
              ))
            )}
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
    </div>
  );
};
