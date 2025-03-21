import { create } from 'zustand';
import accommodations from '../data/accommodationDataset.json';
import {
  Accommodation,
  FilterOption,
  FilterOptionType,
  Subrange,
} from '../types';

interface CarouselCell {
  row: number;
  col: number;
  accommodations: Accommodation[];
}

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
  currentXSublabels: string[];
  currentYSublabels: string[];
  hoveredRow: number | null;
  hoveredColumn: number | null;
  hoveredCell: { row: number; col: number } | null;
  filteredCarouselData: CarouselCell[][]; // Stores accommodations per cell
  updateCarouselData: (
    xAxisFilter: FilterOption,
    yAxisFilter: FilterOption,
    filters: FilterOptionType
  ) => void;
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollUp: () => void;
  scrollDown: () => void;
  resetPosition: () => void;
  updateCarouselSizeAndLabels: (
    rows: number,
    cols: number,
    xLabels: string[],
    yLabels: string[],
    xSublabels: string[],
    ySublabels: string[]
  ) => void;
  setHoveredRow: (row: number) => void;
  setHoveredColumn: (col: number) => void;
  setHoveredCell: (row: number, col: number) => void;
  resetHover: () => void;
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
  currentXSublabels: [],
  currentYSublabels: [],
  hoveredRow: null,
  hoveredColumn: null,
  hoveredCell: null,
  filteredCarouselData: [], // Dynamically populated in the component

  // Function to categorize accommodations into grid cells
  updateCarouselData: (xAxisFilter, yAxisFilter, filters) => {
    const { visibleColumns, visibleRows } = get();
    const carousel: CarouselCell[][] = [];

    // Handle Type Filter Differently
    const isXType = xAxisFilter === FilterOption.Type;
    const isYType = yAxisFilter === FilterOption.Type;

    // Get the correct range object from filters
    const xFilterRanges = isXType
      ? (filters[FilterOption.Type] as string[]) // Type is just a list of strings
      : (filters[xAxisFilter] as Subrange[]); // Otherwise array of Subrange objects

    const yFilterRanges = isYType
      ? (filters[FilterOption.Type] as string[])
      : (filters[yAxisFilter] as Subrange[]);

    if (!xFilterRanges || !yFilterRanges) {
      console.warn('Filter ranges are missing!');
      return false;
    }

    // Generate Labels & Sublabels
    const allXLabels = isXType
      ? (xFilterRanges as string[])
      : (xFilterRanges as Subrange[]).map((r) => r.label);

    const allYLabels = isYType
      ? (yFilterRanges as string[])
      : (yFilterRanges as Subrange[]).map((r) => r.label);

    const allXSublabels = isXType
      ? Array(allXLabels.length).fill('') // Type filter doesn't have sublabels
      : (xFilterRanges as Subrange[]).map((r) => r.sublabel ?? '');

    const allYSublabels = isYType
      ? Array(allYLabels.length).fill('') // Type filter doesn't have sublabels
      : (yFilterRanges as Subrange[]).map((r) => r.sublabel ?? '');

    for (let row = 0; row < allYLabels.length; row++) {
      carousel[row] = [];
      for (let col = 0; col < allXLabels.length; col++) {
        const filteredAccommodations = accommodations.filter((acc) => {
          let isXMatch = false;
          let isYMatch = false;

          // Handle Type separately
          if (isXType) {
            isXMatch = acc.type === allXLabels[col]; // Exact match
          } else {
            // Find matching range
            const xRange = (xFilterRanges as Subrange[]).find(
              (r) => r.label === allXLabels[col]
            );
            if (xRange) {
              isXMatch =
                (!xRange.lowerBound || acc[xAxisFilter] >= xRange.lowerBound) &&
                (!xRange.upperBound || acc[xAxisFilter] < xRange.upperBound);
            }
          }

          if (isYType) {
            isYMatch = acc.type === allYLabels[row]; // Exact match
          } else {
            // Find matching range
            const yRange = (yFilterRanges as Subrange[]).find(
              (r) => r.label === allYLabels[row]
            );
            if (yRange) {
              isYMatch =
                (!yRange.lowerBound || acc[yAxisFilter] >= yRange.lowerBound) &&
                (!yRange.upperBound || acc[yAxisFilter] < yRange.upperBound);
            }
          }

          return isXMatch && isYMatch;
        });

        carousel[row][col] = {
          row,
          col,
          accommodations: filteredAccommodations,
        };
      }
    }

    set({
      filteredCarouselData: carousel,
      allXLabels,
      allYLabels,
      currentXLabels: allXLabels.slice(0, visibleColumns),
      currentYLabels: allYLabels.slice(0, visibleRows),
      currentXSublabels: allXSublabels.slice(0, visibleColumns),
      currentYSublabels: allYSublabels.slice(0, visibleRows),
    });
  },

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

  updateCarouselSizeAndLabels: (
    rows,
    cols,
    xLabels,
    yLabels,
    xSublabels,
    ySublabels
  ) =>
    set({
      totalRows: rows,
      totalColumns: cols,
      allXLabels: xLabels,
      allYLabels: yLabels,
      currentXLabels: xLabels.slice(0, get().visibleColumns),
      currentYLabels: yLabels.slice(0, get().visibleRows),
      currentXSublabels: xSublabels,
      currentYSublabels: ySublabels,
    }),

  setHoveredRow: (row) =>
    set({ hoveredRow: row, hoveredColumn: null, hoveredCell: null }),

  setHoveredColumn: (col) =>
    set({ hoveredColumn: col, hoveredRow: null, hoveredCell: null }),

  setHoveredCell: (row, col) =>
    set({ hoveredCell: { row, col }, hoveredRow: null, hoveredColumn: null }),

  resetHover: () =>
    set(() => ({
      hoveredRow: null,
      hoveredColumn: null,
      hoveredCell: null,
    })),
}));
