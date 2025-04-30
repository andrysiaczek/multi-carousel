import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { accommodationDataset, filters } from '../data';
import { EventType } from '../firebase';
import {
  useAxisFilterStore,
  useFilterHistoryStore,
  useStudyStore,
} from '../store';
import { Accommodation, CarouselCell, Subrange } from '../types';
import {
  buildCarouselGrid,
  drillDownCell,
  drillDownColumn,
  drillDownRow,
  resetColumnOffset,
  resetPosition,
  resetRowOffset,
  scrollDown,
  scrollDownLeft,
  scrollDownRight,
  scrollLeft,
  scrollRight,
  scrollUp,
  scrollUpLeft,
  scrollUpRight,
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
  scrollUpLeft: () => void;
  scrollUpRight: () => void;
  scrollDownLeft: () => void;
  scrollDownRight: () => void;
  resetPosition: () => void;
  resetColumnOffset: () => void;
  resetRowOffset: () => void;

  // Methods: Carousel Setup
  setCarouselData: (carouselData: Accommodation[]) => void;
  populateCarouselData: () => void;
  setCellSize: (width: number, height: number) => void;
  updateCarouselSize: (rows: number, cols: number) => void;
  updateVisibleCarouselSize: (rows: number, cols: number) => void;
  getFilteredAccommodations: () => Accommodation[];

  // Methods: Filtering
  applyDecisionChipsToCarousel: () => void;
  drillDownColumn: (colIndex: number) => void;
  drillDownRow: (rowIndex: number) => void;
  drillDownCell: (colIndex: number, rowIndex: number) => void;

  // Methods: Hover Interaction
  setHoveredColumn: (col: number) => void;
  setHoveredRow: (row: number) => void;
  setHoveredCell: (row: number, col: number) => void;
  resetHover: () => void;

  resetState: () => void;
}

export const initialCarouselState = {
  // Carousel Layout
  cellWidth: 0, // Width of a single cell [px]
  cellHeight: 0, // Height of a single cell [px]
  totalColumns: 0, // Dynamically updated in the component
  totalRows: 0, // Dynamically updated in the component
  visibleColumns: 3, // Default number of visible columns
  visibleRows: 2, // Default number of visible rows
  columnOffset: 0,
  rowOffset: 0,

  // Hover State
  hoveredColumn: null,
  hoveredRow: null,
  hoveredCell: null,

  // Carousel Content
  columnRanges: [],
  rowRanges: [],
  carouselData: accommodationDataset,
  dataPerCell: [],
};

export const useCarouselStore = create<CarouselState>()(
  persist(
    (set, get) => ({
      ...initialCarouselState,

      scrollLeft,
      scrollRight,
      scrollUp,
      scrollDown,
      scrollUpLeft,
      scrollUpRight,
      scrollDownLeft,
      scrollDownRight,
      resetPosition,
      resetColumnOffset,
      resetRowOffset,

      setCarouselData: (carouselData: Accommodation[]) => set({ carouselData }),

      // Function to categorize accommodations into carousel cells
      populateCarouselData: () => {
        const { carouselData } = get();
        const { xAxisFilter, yAxisFilter } = useAxisFilterStore.getState();
        const { getLastSubrange } = useFilterHistoryStore.getState();

        // Get the correct range object from filter history or filters
        const xRanges =
          getLastSubrange(xAxisFilter)?.subranges ?? filters[xAxisFilter];
        const yRanges =
          getLastSubrange(yAxisFilter)?.subranges ?? filters[yAxisFilter];

        if (!xRanges || !yRanges) {
          return console.warn('Filter ranges are missing!');
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

      setCellSize: (width: number, height: number) =>
        set({
          cellWidth: width,
          cellHeight: height,
        }),

      updateCarouselSize: (rows, cols) =>
        set({
          totalRows: rows,
          totalColumns: cols,
        }),

      updateVisibleCarouselSize: (rows, cols) =>
        set({
          visibleRows: rows,
          visibleColumns: cols,
        }),

      // Returns a list of unique filtered accommodations after applying carousel and decision chip filters
      getFilteredAccommodations: () => {
        const allAccommodations = get()
          .dataPerCell.flat()
          .map((cell) => cell.accommodations)
          .flat();

        const uniqueAccommodations = allAccommodations.reduce((acc, curr) => {
          if (!acc.has(curr.id)) {
            acc.set(curr.id, curr);
          }
          return acc;
        }, new Map());

        return Array.from(uniqueAccommodations.values());
      },

      // Reapply decision chip filters to the carousel grid when selection changes
      applyDecisionChipsToCarousel: () => {
        const { columnRanges, rowRanges, carouselData } = get();
        const { xAxisFilter, yAxisFilter } = useAxisFilterStore.getState();

        if (
          !xAxisFilter ||
          !yAxisFilter ||
          !columnRanges.length ||
          !rowRanges.length
        )
          return;

        const { carousel } = buildCarouselGrid(
          columnRanges,
          rowRanges,
          carouselData,
          xAxisFilter,
          yAxisFilter
        );

        set({
          dataPerCell: carousel,
        });
      },

      drillDownColumn,
      drillDownRow,
      drillDownCell,

      setHoveredRow: (row) => {
        useStudyStore.getState().logEvent(EventType.Hover, {
          targetType: 'row',
          yAxis: {
            filterType: useAxisFilterStore.getState().yAxisFilter,
            filterValue: get().rowRanges[row].label,
          },
        });

        set({ hoveredRow: row, hoveredColumn: null, hoveredCell: null });
      },

      setHoveredColumn: (col) => {
        useStudyStore.getState().logEvent(EventType.Hover, {
          targetType: 'column',
          xAxis: {
            filterType: useAxisFilterStore.getState().xAxisFilter,
            filterValue: get().columnRanges[col].label,
          },
        });

        set({ hoveredColumn: col, hoveredRow: null, hoveredCell: null });
      },

      setHoveredCell: (row, col) => {
        const { xAxisFilter, yAxisFilter } = useAxisFilterStore.getState();
        useStudyStore.getState().logEvent(EventType.Hover, {
          targetType: 'cell',
          xAxis: {
            filterType: xAxisFilter,
            filterValue: get().columnRanges[col].label,
          },
          yAxis: {
            filterType: yAxisFilter,
            filterValue: get().rowRanges[row].label,
          },
        });

        set({
          hoveredCell: { row, col },
          hoveredRow: null,
          hoveredColumn: null,
        });
      },

      resetHover: () =>
        set(() => ({
          hoveredRow: null,
          hoveredColumn: null,
          hoveredCell: null,
        })),

      resetState: () => set(initialCarouselState),
    }),
    {
      name: 'carousel-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        cellWidth: state.cellWidth,
        cellHeight: state.cellHeight,
        totalColumns: state.totalColumns,
        totalRows: state.totalRows,
        visibleColumns: state.visibleColumns,
        visibleRows: state.visibleRows,
        columnOffset: state.columnOffset,
        rowOffset: state.rowOffset,
        columnRanges: state.columnRanges,
        rowRanges: state.rowRanges,
        carouselData: state.carouselData,
      }),
    }
  )
);
