import { useCarouselStore } from '../store/useCarouselStore';

interface CarouselCellProps {
  row: number;
  col: number;
  xLabel: string;
  yLabel: string;
  isFillerCell: boolean;
}

export const CarouselCell = ({
  row,
  col,
  xLabel,
  yLabel,
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
          : 'bg-white'
      }`}
      onMouseEnter={() => setHoveredCell(row, col)}
      onMouseLeave={() => resetHover()}
    >
      <div className="text-center">
        <span className="font-medium">{!isFillerCell && xLabel}</span>
        <br />
        <span className="text-gray-600">{!isFillerCell && yLabel}</span>
      </div>
    </div>
  );
};
