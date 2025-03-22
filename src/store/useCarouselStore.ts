import { create } from 'zustand';
import { accommodationDataset } from '../data';
import {
  Accommodation,
  CarouselCell,
  FilterOption,
  FilterOptionType,
  Subrange,
} from '../types';
import { buildCarouselGrid } from '../utils';

interface CarouselState {
  // Carousel Layout
  cellWidth: number;
  cellHeight: number;
  totalColumns: number;
  totalRows: number;
  visibleColumns: number;
  visibleRows: number;
  columnOffset: number;
  rowOffset: number;

  // Hover State
  hoveredColumn: number | null;
  hoveredRow: number | null;
  hoveredCell: { row: number; col: number } | null;

  // Carousel Content
  columnRanges: Subrange[];
  rowRanges: Subrange[];
  carouselData: Accommodation[]; // Array of all filtered accommodations in current carousel
  dataPerCell: CarouselCell[][]; // 2D grid of accommodations grouped by cell

  // Methods: Navigation
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollUp: () => void;
  scrollDown: () => void;
  resetPosition: () => void;

  // Methods: Carousel Setup
  updateCarouselSize: (rows: number, cols: number) => void;
  populateCarouselData: (
    xAxisFilter: FilterOption,
    yAxisFilter: FilterOption,
    filters: FilterOptionType
  ) => void;

  // Methods: Filtering
  drillDownColumn: (
    colIndex: number,
    xAxisFilter: FilterOption,
    yAxisFilter: FilterOption,
    filters: FilterOptionType
  ) => void;
  drillDownRow: (
    rowIndex: number,
    xAxisFilter: FilterOption,
    yAxisFilter: FilterOption,
    filters: FilterOptionType
  ) => void;
  drillDownCell: (
    colIndex: number,
    rowIndex: number,
    xAxisFilter: FilterOption,
    yAxisFilter: FilterOption,
    filters: FilterOptionType
  ) => void;

  // Methods: Hover Interaction
  setHoveredColumn: (col: number) => void;
  setHoveredRow: (row: number) => void;
  setHoveredCell: (row: number, col: number) => void;
  resetHover: () => void;
}

export const useCarouselStore = create<CarouselState>((set, get) => ({
  cellWidth: 200, // Default width of a single cell [px]
  cellHeight: 150, // Default height of a single cell [px]
  totalColumns: 0, // Dynamically updated in the component
  totalRows: 0, // Dynamically updated in the component
  visibleColumns: 3, // Default number of visible columns
  visibleRows: 2, // Default number of visible rows
  columnOffset: 0,
  rowOffset: 0,

  columnRanges: [],
  rowRanges: [],
  carouselData: accommodationDataset,
  dataPerCell: [], // Dynamically populated in the component

  hoveredColumn: null,
  hoveredRow: null,
  hoveredCell: null,

  scrollLeft: () =>
    set((state) => {
      return {
        columnOffset:
          state.columnOffset === 0
            ? state.totalColumns - (state.visibleColumns - 1)
            : state.columnOffset - 1,
      };
    }),

  scrollRight: () =>
    set((state) => {
      return {
        columnOffset: (state.columnOffset + 1) % state.totalColumns,
      };
    }),

  scrollUp: () =>
    set((state) => {
      return {
        rowOffset:
          state.rowOffset === 0
            ? state.totalRows - (state.visibleRows - 1)
            : state.rowOffset - 1,
      };
    }),

  scrollDown: () =>
    set((state) => {
      return {
        rowOffset: (state.rowOffset + 1) % state.totalRows,
      };
    }),

  resetPosition: () => set({ rowOffset: 0, columnOffset: 0 }),

  updateCarouselSize: (rows, cols) =>
    set({
      totalRows: rows,
      totalColumns: cols,
    }),

  // Function to categorize accommodations into grid cells
  populateCarouselData: (xAxisFilter, yAxisFilter, filters) => {
    const { carouselData } = get();

    // Get the correct range object from filters
    const xRanges = filters[xAxisFilter] as Subrange[];
    const yRanges = filters[yAxisFilter] as Subrange[];

    if (!xRanges || !yRanges) {
      console.warn('Filter ranges are missing!');
      return false;
    }

    const { carousel } = buildCarouselGrid(
      xRanges,
      yRanges,
      carouselData,
      xAxisFilter,
      yAxisFilter
    );

    set({
      columnRanges: xRanges,
      rowRanges: yRanges,
      dataPerCell: carousel,
    });
  },

  drillDownColumn: (colIndex, xAxisFilter, yAxisFilter, filters) => {
    const { columnRanges, rowRanges, carouselData } = get();

    const parentRange = filters[xAxisFilter].find(
      (r) => r.label === columnRanges[colIndex].label
    );

    if (!parentRange?.subranges) {
      console.warn('No subranges to drill into for selected column.');
      return;
    }

    const { carousel, accommodations } = buildCarouselGrid(
      parentRange.subranges,
      rowRanges,
      carouselData,
      xAxisFilter,
      yAxisFilter
    );

    console.log(
      'Accommodations length after column drill: ',
      accommodations.length
    );

    set({
      columnOffset: 0,
      columnRanges: parentRange.subranges,
      dataPerCell: carousel,
      carouselData: accommodations,
    });
  },

  drillDownRow: (rowIndex, xAxisFilter, yAxisFilter, filters) => {
    const { columnRanges, rowRanges, carouselData } = get();

    const parentRange = filters[yAxisFilter].find(
      (r) => r.label === rowRanges[rowIndex].label
    );

    if (!parentRange?.subranges) {
      console.warn('No subranges to drill into for selected row.');
      return;
    }

    const { carousel, accommodations } = buildCarouselGrid(
      columnRanges,
      parentRange.subranges,
      carouselData,
      xAxisFilter,
      yAxisFilter
    );

    console.log(
      'Accommodations length after row drill: ',
      accommodations.length
    );

    set({
      rowOffset: 0,
      rowRanges: parentRange.subranges,
      dataPerCell: carousel,
      carouselData: accommodations,
    });
  },

  drillDownCell: (colIndex, rowIndex, xAxisFilter, yAxisFilter, filters) => {
    const { columnRanges, rowRanges, carouselData } = get();

    const xParent = filters[xAxisFilter].find(
      (r) => r.label === columnRanges[colIndex].label
    );
    const yParent = filters[yAxisFilter].find(
      (r) => r.label === rowRanges[rowIndex].label
    );

    if (!xParent?.subranges || !yParent?.subranges) {
      console.warn('No subranges to drill into for selected cell.');
      return;
    }

    const { carousel, accommodations } = buildCarouselGrid(
      xParent.subranges,
      yParent.subranges,
      carouselData,
      xAxisFilter,
      yAxisFilter
    );

    set({
      columnOffset: 0,
      rowOffset: 0,
      columnRanges: xParent.subranges,
      rowRanges: yParent.subranges,
      dataPerCell: carousel,
      carouselData: accommodations,
    });
  },

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
