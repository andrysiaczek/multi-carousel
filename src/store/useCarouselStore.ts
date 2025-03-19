import { create } from 'zustand';

interface CarouselState {
  rowOffset: number;
  columnOffset: number;
  totalRows: number;
  totalColumns: number;
  visibleRows: number;
  visibleColumns: number;
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
  updateGridSize: (rows: number, cols: number) => void;
}

export const useCarouselStore = create<CarouselState>((set) => ({
  rowOffset: 0,
  columnOffset: 0,
  totalRows: 0, // Dynamically updated in the component
  totalColumns: 0, // Dynamically updated in the component
  visibleRows: 2, // Default number of visible rows
  visibleColumns: 3, // Default number of visible columns
  selectedColumn: null,
  selectedRow: null,
  selectedCell: null,

  scrollLeft: () =>
    set((state) => ({
      columnOffset:
        state.columnOffset === 0
          ? state.totalColumns - (state.visibleColumns - 1)
          : state.columnOffset - 1,
    })),

  scrollRight: () =>
    set((state) => ({
      columnOffset: (state.columnOffset + 1) % state.totalColumns,
    })),

  scrollUp: () =>
    set((state) => ({
      rowOffset:
        state.rowOffset === 0
          ? state.totalRows - (state.visibleRows - 1)
          : state.rowOffset - 1,
    })),

  scrollDown: () =>
    set((state) => ({
      rowOffset: (state.rowOffset + 1) % state.totalRows,
    })),

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

  updateGridSize: (rows, cols) => set({ totalRows: rows, totalColumns: cols }),
}));
