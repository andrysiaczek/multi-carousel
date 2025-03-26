import { useCarouselStore, useFilterHistoryStore } from '../store';
import { Accommodation, Subrange } from '../types';

interface CarouselCellProps {
  col: number;
  row: number;
  columnRange: Subrange;
  rowRange: Subrange;
  accommodations: Accommodation[];
  isFillerCell: boolean;
}

export const CarouselCell = ({
  col,
  row,
  columnRange,
  rowRange,
  accommodations,
  isFillerCell = false,
}: CarouselCellProps) => {
  const {
    cellWidth,
    cellHeight,
    hoveredColumn,
    hoveredRow,
    hoveredCell,
    setHoveredCell,
    resetHover,
    drillDownCell,
  } = useCarouselStore();
  const { setHoveredStep, resetHoveredStep } = useFilterHistoryStore();

  // Determine if this cell, row, or column is being hovered
  const isHoveredRow = hoveredRow === row;
  const isHoveredColumn = hoveredColumn === col;
  const isHoveredCell = hoveredCell?.row === row && hoveredCell?.col === col;

  const handleMouseEnter = () => {
    setHoveredCell(row, col);
    setHoveredStep(columnRange, rowRange);
  };

  const handleMouseLeave = () => {
    resetHover();
    resetHoveredStep();
  };

  return (
    <div
      className={`w-[${cellWidth}px] h-[${cellHeight}px] flex items-center justify-center border transition cursor-pointer ${
        !isFillerCell && (isHoveredRow || isHoveredColumn || isHoveredCell)
          ? 'bg-lightOrange'
          : isFillerCell
          ? 'bg-gray-100'
          : 'bg-white'
      }`}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      onClick={() => drillDownCell(col, row)}
    >
      {!isFillerCell && (
        <>
          <div className="text-center">
            <span className="text-gray-600">{columnRange.label}</span>
            <br />
            <span className="text-gray-600">{rowRange.label}</span>
            <br />
            <span className="font-medium text-lg">{accommodations.length}</span>
            <span className="text-gray-600 text-sm"> accommodations</span>
          </div>
        </>
      )}
    </div>
  );
};
