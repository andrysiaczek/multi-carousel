import { useEffect } from 'react';

interface Options {
  ref: React.RefObject<HTMLElement | null>;
  maxCols: number;
  maxRows: number;
  minCellWidth: number;
  minCellHeight: number;
  gap: number;
  onResize: (
    cols: number,
    rows: number,
    cellWidth: number,
    cellHeight: number
  ) => void;
}

/**
 * Hook that calculates optimal number of grid cells and dimensions for a carousel layout
 * based on container size, max rows/cols, and min cell sizes.
 */

export const useResponsiveCarousel = ({
  ref,
  maxCols,
  maxRows,
  minCellWidth,
  minCellHeight,
  gap,
  onResize,
}: Options) => {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const ARROW_OFFSET = 72; // 2 arrows * 26px + 20px buffer

      const offsetWidth = container.offsetWidth - ARROW_OFFSET;
      const offsetHeight = container.offsetHeight - ARROW_OFFSET * 1.2;

      // Determine how many columns and rows we can fit
      const possibleCols = Math.min(
        maxCols,
        Math.floor((offsetWidth + gap) / (minCellWidth + gap))
      );
      const possibleRows = Math.min(
        maxRows,
        Math.floor((offsetHeight + gap) / (minCellHeight + gap))
      );

      // Determine how large we can make each cell
      const cellWidth = Math.floor((offsetWidth + gap) / possibleCols) - gap;
      const cellHeight = Math.floor((offsetHeight + gap) / possibleRows) - gap;

      onResize(
        possibleCols,
        possibleRows,
        Math.max(minCellWidth, cellWidth),
        Math.max(minCellHeight, cellHeight)
      );
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);
};
