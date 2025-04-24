import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { accommodationDataset } from '../data';
import { useAxisFilterStore, useCarouselStore } from '../store';
import {
  Axis,
  DrillStep,
  FilterOption,
  NewDrillStep,
  Subrange,
} from '../types';
import { generateFilterLabel, restoreAxisFiltersFromStep } from '../utils';

const initialStep: DrillStep = {
  stepNumber: 0,
  label: 'Reset',
  xAxisFilter: FilterOption.Price,
  yAxisFilter: FilterOption.Rating,
  filterState: {
    [FilterOption.Distance]: null,
    [FilterOption.Price]: null,
    [FilterOption.Rating]: null,
    [FilterOption.Type]: null,
  },
  carouselDataSnapshot: accommodationDataset,
};

interface FilterHistoryState {
  steps: DrillStep[];
  hoveredStepLabel: string | null;

  getLastStep: () => DrillStep | null;
  getLastSubrange: (filter: FilterOption) => Subrange | null;

  addStep: (step: NewDrillStep) => void;
  goToStep: (index: number) => void;
  resetHistory: () => void;

  setHoveredStep: (columnRange: Subrange, rowRange: Subrange) => void;
  setHoveredStepForAxis: (axis: Axis, range: Subrange) => void;
  resetHoveredStep: () => void;
}

export const useFilterHistoryStore = create<FilterHistoryState>()(
  persist(
    (set, get) => ({
      steps: [initialStep],
      hoveredStepLabel: null,

      getLastStep: () => {
        const steps = get().steps;
        return steps.length ? steps[steps.length - 1] : null;
      },

      getLastSubrange: (filter) => {
        return get().getLastStep()?.filterState[filter] || null;
      },

      addStep: (step) =>
        set((state) => ({
          steps: [
            ...state.steps,
            {
              ...step,
              stepNumber: state.steps.length + 1,
            },
          ],
          hoveredStepLabel: null,
        })),

      goToStep: (stepNumber) => {
        const { setCarouselData } = useCarouselStore.getState();
        const steps = get().steps.slice(0, stepNumber + 1);
        const lastStep = steps[steps.length - 1];

        if (!lastStep) return;

        set({ steps, hoveredStepLabel: null });
        setCarouselData(lastStep.carouselDataSnapshot);
        restoreAxisFiltersFromStep(lastStep);
      },

      resetHistory: () => set({ steps: [], hoveredStepLabel: null }),

      setHoveredStep: (columnRange, rowRange) => {
        const { xAxisFilter, yAxisFilter } = useAxisFilterStore.getState();

        set({
          hoveredStepLabel: generateFilterLabel(
            xAxisFilter,
            columnRange,
            yAxisFilter,
            rowRange
          ),
        });
      },

      setHoveredStepForAxis: (axis, range) => {
        const { xAxisFilter, yAxisFilter } = useAxisFilterStore.getState();
        const filter = axis === Axis.X ? xAxisFilter : yAxisFilter;

        set({ hoveredStepLabel: generateFilterLabel(filter, range) });
      },

      resetHoveredStep: () => set({ hoveredStepLabel: null }),
    }),
    {
      name: 'filter-history-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
