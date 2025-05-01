import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { accommodationDataset } from '../data';
import { EventType } from '../firebase';
import { useAxisFilterStore, useCarouselStore, useStudyStore } from '../store';
import {
  Axis,
  DrillStep,
  FilterOption,
  NewDrillStep,
  Subrange,
} from '../types';
import { generateFilterLabel } from '../utils';

const initialStep: DrillStep = {
  stepNumber: 0,
  label: 'Reset',
  xAxisFilter: FilterOption.Price,
  yAxisFilter: FilterOption.Rating,
  xAxisFilterAfter: FilterOption.Price,
  yAxisFilterAfter: FilterOption.Rating,
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
  resetState: () => void;
}

const initialFilterHistoryState = {
  steps: [initialStep],
  hoveredStepLabel: null,
};

export const useFilterHistoryStore = create<FilterHistoryState>()(
  persist(
    (set, get) => ({
      ...initialFilterHistoryState,

      getLastStep: () => {
        const steps = get().steps;
        return steps.length ? steps[steps.length - 1] : null;
      },

      getLastSubrange: (filter) => {
        return get().getLastStep()?.filterState[filter] || null;
      },

      addStep: (step) =>
        set((state) => {
          const stepNumber = state.steps.length + 1;

          useStudyStore.getState().logEvent(EventType.FilterStep, {
            stepNumber: stepNumber,
            label: step.label,
            xFilter: { filterType: step.xAxisFilter },
            yFilter: { filterType: step.yAxisFilter },
            xFilterAfter: { filterType: step.xAxisFilterAfter },
            yFilterAfter: { filterType: step.yAxisFilterAfter },
            accommodationIds: step.carouselDataSnapshot.map((acc) => acc.id),
          });

          return {
            steps: [
              ...state.steps,
              {
                ...step,
                stepNumber,
              },
            ],
            hoveredStepLabel: null,
          };
        }),

      goToStep: (stepNumber) => {
        const { setAxisFiltersAndType } = useAxisFilterStore.getState();
        const { setCarouselData } = useCarouselStore.getState();
        const steps = get().steps.slice(0, stepNumber + 1);
        const lastStep = steps[steps.length - 1];

        if (!lastStep) return;

        useStudyStore.getState().logEvent(EventType.FilterStep, {
          stepNumber: stepNumber,
          label: lastStep.label,
          xFilter: { filterType: lastStep.xAxisFilter },
          yFilter: { filterType: lastStep.yAxisFilter },
          xFilterAfter: { filterType: lastStep.xAxisFilterAfter },
          yFilterAfter: { filterType: lastStep.yAxisFilterAfter },
          accommodationIds: lastStep.carouselDataSnapshot.map((acc) => acc.id),
        });

        set({ steps, hoveredStepLabel: null });
        setCarouselData(lastStep.carouselDataSnapshot);
        setAxisFiltersAndType(
          lastStep.xAxisFilterAfter,
          lastStep.yAxisFilterAfter,
          lastStep.filterState[FilterOption.Type]?.label ?? null
        );
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

      resetState: () => set(initialFilterHistoryState),
    }),
    {
      name: 'filter-history-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
