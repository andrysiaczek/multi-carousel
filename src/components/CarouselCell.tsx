import { Accommodation } from '../types';
import { useCarouselStore } from '../store/useCarouselStore';

interface CarouselCellProps {
  row: number;
  col: number;
  xLabel: string;
  yLabel: string;
  accommodations: Accommodation[];
  isFillerCell: boolean;
}

export const CarouselCell = ({
  row,
  col,
  xLabel,
  yLabel,
  accommodations,
  isFillerCell = false,
}: CarouselCellProps) => {
  const {
    cellHeight,
    cellWidth,
    hoveredRow,
    hoveredColumn,
    hoveredCell,
    setHoveredCell,
    resetHover,
  } = useCarouselStore();

  // Determine if this cell, row, or column is being hovered
  const isHoveredRow = hoveredRow === row;
  const isHoveredColumn = hoveredColumn === col;
  const isHoveredCell = hoveredCell?.row === row && hoveredCell?.col === col;

  return (
    <div
      className={`w-[${cellWidth}px] h-[${cellHeight}px] flex items-center justify-center border transition ${
        !isFillerCell && (isHoveredRow || isHoveredColumn || isHoveredCell)
          ? 'bg-lightOrange'
          : isFillerCell
          ? 'bg-gray-100'
          : 'bg-white'
      }`}
      onMouseEnter={() => setHoveredCell(row, col)}
      onMouseLeave={() => resetHover()}
    >
      {!isFillerCell && (
        <>
          <div className="text-center">
            <span className="text-gray-600">{xLabel}</span>
            <br />
            <span className="text-gray-600">{yLabel}</span>
            <br />
            <span className="font-medium text-lg">{accommodations.length}</span>
            <span className="text-gray-600 text-sm"> accommodations</span>
          </div>
        </>
      )}
    </div>
  );
};
