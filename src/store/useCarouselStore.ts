import { create } from 'zustand';
import { accommodationDataset } from '../data';
import {
  Accommodation,
  CarouselCell,
  FilterOption,
  FilterOptionType,
  Subrange,
} from '../types';
import {
  buildCarouselGrid,
  drillDownCell,
  drillDownColumn,
  drillDownRow,
  resetPosition,
  scrollDown,
  scrollLeft,
  scrollRight,
  scrollUp,
} from '../utils';

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

  scrollLeft,
  scrollRight,
  scrollUp,
  scrollDown,
  resetPosition,

  drillDownColumn,
  drillDownRow,
  drillDownCell,

  updateCarouselSize: (rows, cols) =>
    set({
      totalRows: rows,
      totalColumns: cols,
    }),

  // Function to categorize accommodations into grid cells
  populateCarouselData: (xAxisFilter, yAxisFilter, filters) => {
    const { carouselData } = get();

    // Get the correct range object from filters
    // TODO: FilterHistory: Retrieve the last selected subrange for each axis from filter history
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
