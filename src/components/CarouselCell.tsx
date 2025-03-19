import { useCarouselStore } from '../store/useCarouselStore';

interface CarouselCellProps {
  row: number;
  col: number;
  xLabel: string;
  yLabel: string;
}

export const CarouselCell = ({
  row,
  col,
  xLabel,
  yLabel,
}: CarouselCellProps) => {
  const {
    selectedColumn,
    selectedRow,
    selectedCell,
    selectRow,
    selectColumn,
    selectCell,
  } = useCarouselStore();

  // Check if this column/row/cell is selected
  const isSelectedColumn = selectedColumn === col;
  const isSelectedRow = selectedRow === row;
  const isSelectedCell = selectedCell?.row === row && selectedCell?.col === col;

  return (
    <div
      className={`w-[200px] h-[150px] flex items-center justify-center border transition ${
        isSelectedColumn || isSelectedRow || isSelectedCell
          ? 'bg-lightOrange'
          : 'bg-white'
      }`}
      onClick={(e) => {
        if (e.shiftKey) selectColumn(col);
        else if (e.altKey) selectRow(row);
        else selectCell(row, col);
      }}
    >
      <div className="text-center">
        <span className="font-medium">{xLabel}</span>
        <br />
        <span className="text-gray-600">{yLabel}</span>
      </div>
    </div>
  );
};
