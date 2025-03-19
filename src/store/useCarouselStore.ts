import { create } from 'zustand';

interface CarouselState {
  rowOffset: number;
  columnOffset: number;
  cellHeight: number;
  cellWidth: number;
  totalRows: number;
  totalColumns: number;
  visibleRows: number;
  visibleColumns: number;
  allXLabels: string[];
  allYLabels: string[];
  currentXLabels: string[];
  currentYLabels: string[];
  selectedRow: number | null;
  selectedColumn: number | null;
  selectedCell: { row: number; col: number } | null;
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollUp: () => void;
  scrollDown: () => void;
  resetPosition: () => void;
  selectRow: (row: number) => void;
  selectColumn: (col: number) => void;
  selectCell: (row: number, col: number) => void;
  resetSelection: () => void;
  updateGridSize: (
    rows: number,
    cols: number,
    xLabels: string[],
    yLabels: string[]
  ) => void;
}

export const useCarouselStore = create<CarouselState>((set, get) => ({
  rowOffset: 0,
  columnOffset: 0,
  cellHeight: 150, // Default height of a single cell [px]
  cellWidth: 200, // Default width of a single cell [px]
  totalRows: 0, // Dynamically updated in the component
  totalColumns: 0, // Dynamically updated in the component
  visibleRows: 2, // Default number of visible rows
  visibleColumns: 3, // Default number of visible columns
  allXLabels: [],
  allYLabels: [],
  currentXLabels: [],
  currentYLabels: [],
  selectedColumn: null,
  selectedRow: null,
  selectedCell: null,

  scrollLeft: () =>
    set((state) => {
      const newOffset =
        state.columnOffset === 0
          ? state.totalColumns - (state.visibleColumns - 1)
          : state.columnOffset - 1;
      return {
        columnOffset: newOffset,
        currentXLabels: get().allXLabels.slice(
          newOffset,
          newOffset + state.visibleColumns
        ),
      };
    }),

  scrollRight: () =>
    set((state) => {
      const newOffset = (state.columnOffset + 1) % state.totalColumns;
      return {
        columnOffset: newOffset,
        currentXLabels: get().allXLabels.slice(
          newOffset,
          newOffset + state.visibleColumns
        ),
      };
    }),

  scrollUp: () =>
    set((state) => {
      const newOffset =
        state.rowOffset === 0
          ? state.totalRows - (state.visibleRows - 1)
          : state.rowOffset - 1;
      return {
        rowOffset: newOffset,
        currentYLabels: get().allYLabels.slice(
          newOffset,
          newOffset + state.visibleRows
        ),
      };
    }),

  scrollDown: () =>
    set((state) => {
      const newOffset = (state.rowOffset + 1) % state.totalRows;
      return {
        rowOffset: newOffset,
        currentYLabels: get().allYLabels.slice(
          newOffset,
          newOffset + state.visibleRows
        ),
      };
    }),

  resetPosition: () => set({ rowOffset: 0, columnOffset: 0 }),

  selectColumn: (col) =>
    set(() => ({ selectedColumn: col, selectedRow: null, selectedCell: null })),

  selectRow: (row) =>
    set(() => ({ selectedRow: row, selectedColumn: null, selectedCell: null })),

  selectCell: (row, col) =>
    set(() => ({
      selectedCell: { row, col },
      selectedColumn: null,
      selectedRow: null,
    })),

  resetSelection: () =>
    set(() => ({
      selectedColumn: null,
      selectedRow: null,
      selectedCell: null,
    })),

  updateGridSize: (rows, cols, xLabels, yLabels) =>
    set({
      totalRows: rows,
      totalColumns: cols,
      allXLabels: xLabels,
      allYLabels: yLabels,
      currentXLabels: xLabels.slice(0, get().visibleColumns),
      currentYLabels: yLabels.slice(0, get().visibleRows),
    }),
}));
